variable "do-token" {}

provider "digitalocean" {
  token = "${var.do-token}"
}

variable "cluster-name" {}
variable "cluster-region" {}
variable "cluster-version" {}
variable "cluster-node-pool-name" {}
variable "cluster-node-pool-size" {}
variable "cluster-node-pool-node-count" {}

resource "digitalocean_kubernetes_cluster" "cluster" {
  name    = "${var.cluster-name}"
  region  = "${var.cluster-region}"
  version = "${var.cluster-version}"
  tags = ["${var.cluster-name}"]

  node_pool {
    name       = "${var.cluster-node-pool-name}"
    size       = "${var.cluster-node-pool-size}"
    node_count = "${var.cluster-node-pool-node-count}"
  }
}

provider "kubernetes" {
  host = "${digitalocean_kubernetes_cluster.cluster.endpoint}"

  client_certificate = "${base64decode(digitalocean_kubernetes_cluster.cluster.kube_config.0.client_certificate)}"
  client_key = "${base64decode(digitalocean_kubernetes_cluster.cluster.kube_config.0.client_key)}"
  cluster_ca_certificate = "${base64decode(digitalocean_kubernetes_cluster.cluster.kube_config.0.cluster_ca_certificate)}"
}

resource "kubernetes_namespace" "prod" {
  metadata {
    name = "${var.cluster-name}"
    labels {
      env = "prod"
    }
  }
}

variable "app-domain" {}

resource "digitalocean_domain" "domain" {
  name = "${var.app-domain}"
}


resource "digitalocean_certificate" "cert" {
  name = "${var.cluster-name}"
  type = "lets_encrypt"
  domains = ["${var.app-domain}"]
}

resource "local_file" "kubeconfig" {
  content = "${digitalocean_kubernetes_cluster.cluster.kube_config.0.raw_config}"
  filename = "${path.module}/.kubeconfig"
}

# https://www.digitalocean.com/docs/kubernetes/how-to/add-volumes/
resource "kubernetes_persistent_volume_claim" "db" {
  metadata {
    name = "db"
  }
  spec {
    access_modes = ["ReadWriteOnce"]
    resources {
      requests {
        storage = "5Gi"
      }
    }
    storage_class_name = "do-block-storage"
  }
}

# $ kubectl --kubeconfig ./.kubeconfig get pv
#   NAME                                       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM        STORAGECLASS       REASON   AGE
#   pvc-7917652f-24be-11e9-95a5-ce055e4cb34e   5Gi        RWO            Delete           Bound    default/db   do-block-storage            28s

# https://github.com/helm/charts/tree/master/stable/postgresql
# https://medium.com/kokster/postgresql-on-kubernetes-the-right-way-part-one-d174ee8a56e3

resource "kubernetes_service_account" "tiller" {
  metadata {
    name = "tiller"
    namespace = "kube-system"
  }
}

resource "kubernetes_cluster_role_binding" "tiller" {
  metadata {
    name = "tiller"
  }
  role_ref {
    api_group = "rbac.authorization.k8s.io"
    kind = "ClusterRole"
    name = "cluster-admin"
  }
  subject {
    # https://github.com/terraform-providers/terraform-provider-kubernetes/issues/204
    api_group = ""
    kind = "ServiceAccount"
    name = "tiller"
    namespace = "kube-system"
  }
 }


provider "helm" {
  install_tiller = true
  service_account = "${kubernetes_service_account.tiller.metadata.0.name}"
  kubernetes {
    host = "${digitalocean_kubernetes_cluster.cluster.endpoint}"
    config_path = "${path.module}/.kubeconfig"
  }
}

resource "helm_release" "db" {
  name = "db"
  chart = "stable/postgresql"
  values = [
    "${file("db-values.yaml")}"
  ]
}