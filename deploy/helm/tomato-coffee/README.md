# Tomato Coffee

Tomato Coffee is a Pomodoro + GTD application.

TL;DR;

```bash
$ helm install --wait --repository=https://www.soasme.com/tomato-coffee/charts tomato-coffee
```

## Introduction

This chart bootstrap a Tomato Coffee deployment on Kubernetes cluster using Helm package manager.

It has two optional packages which are required for Tomato Coffee.

* [Postgresql](https://github.com/kubernetes/charts/tree/master/stable/postgresql)

## Prerequisites

* Kubernetes 1.4+ with Beta APIs enabled
* PV provisioner support in the underlying infrastructure (with persistence storage enabled)

## Installing the Chart

To install the chart with the name `vanilla-release`:

```bash
$ helm install --name vanilla-release --wait --repository=https://www.soasme.com/tomato-coffee/charts tomato-coffee
```

Typo `helm list` to check the release status.

## Uninstalling the Chart

To uninstall the `vanilla-release`:

```bash
$ helm delete vanilla-release
```

The command removes all the Kubernetes components associated with the chart and deletes the release.

## Configuration

The following table provides all configurable options of the chart.

| **Parameter** | **Description** | **Default** |
| ------------- | --------------- | ----------- |
| `api.image.repository` | Tomato Coffee image | `soasme/tomato-coffee` |
| `api.image.tag` | Tomato Coffee image tag | `0.2.8-api` |
| `api.imagePullPolicy` | Image pull policy | `IfNotPresent` |
| `api.podAnnotations`                 | API pod annotations                         | `{}`                                                       |
| `api.replicacount`                   | Amount of API pods to run                   | `1`                                                        |
| `api.resources.limits`               | API resource limits                         | `{cpu: 500m, memory: 500Mi}`                               |
| `api.resources.requests`             | API resource requests                       | `{cpu: 300m, memory: 300Mi}`                               |
| `api.env`                            | Additional API environment variables        | `[{name: GITHUB_APP_ID}, {name: GITHUB_API_SECRET}]`       |
| `api.nodeSelector`                   | Node labels for API pod assignment          | `{}`                                                       |
| `api.affinity`                       | Affinity settings for API pod assignment    | `{}`                                                       |
| `api.tolerations`                    | Toleration labels for API pod assignment    | `[]`                                                       |
| `dash.image.repository` | Tomato Coffee image | `soasme/tomato-coffee` |
| `dash.image.tag` | Tomato Coffee image tag | `0.2.8-dash` |
| `dash.imagePullPolicy` | Image pull policy | `IfNotPresent` |

