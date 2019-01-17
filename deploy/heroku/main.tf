provider "heroku" {}

variable "app-name" {
  type = "string"
}

variable "app-version" {
  type = "string"
}

variable "region" {
  type = "string"
  default = "us"
}

variable "github-client-id" {
  type = "string"
}

variable "github-client-secret" {
  type = "string"
}

variable "secret-key" {
  type = "string"
}

variable "git-url" {
  type = "string"
  default = "git@github.com:soasme/tomato-coffee.git"
}

resource "heroku_app" "app" {
    name = "${var.app-name}"
    region = "${var.region}"

    config_vars {
        SECRET_KEY = "${var.secret-key}"
        GITHUB_CLIENT_ID = "${var.github-client-id}"
        GITHUB_CLIENT_SECRET = "${var.github-client-secret}"
    }

    buildpacks = [
      "https://github.com/dpiddy/heroku-buildpack-runit.git",
      "heroku/python",
      "heroku/nodejs",
    ]
}

resource "heroku_build" "app" {
  app        = "${heroku_app.app.id}"

  source = {
    # This app uses a community buildpack, set it in `buildpacks` above.
    url     = "https://github.com/soasme/tomato-coffee/archive/${var.app-version}.tar.gz"
    version = "${var.app-version}"
  }
}
