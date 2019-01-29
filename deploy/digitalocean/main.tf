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

# https://github.com/helm/helm/blob/master/docs/rbac.md

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
  kubernetes {
    host = "${digitalocean_kubernetes_cluster.cluster.endpoint}"
    service_account = "${kubernetes_service_account.tiller.metadata.0.name}"
    client_certificate = "${base64decode(digitalocean_kubernetes_cluster.cluster.kube_config.0.client_certificate)}"
    client_key = "${base64decode(digitalocean_kubernetes_cluster.cluster.kube_config.0.client_key)}"
    cluster_ca_certificate = "${base64decode(digitalocean_kubernetes_cluster.cluster.kube_config.0.cluster_ca_certificate)}"
  }
}



#resource "helm_release" "minio" {
#  name = "object-storage"
#  chart = "minio"
#  values = [
#    "${file("object-storage-values.yaml")}"
#  ]
#}
