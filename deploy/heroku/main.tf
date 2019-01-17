provider "heroku" {}

variable "app-name" {
  type = "string"
}

variable "app-version" {
  type = "string"
}

variable "database-plan" {
  type = "string"
  default = "hobby-dev"
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

variable "github-redirect-uri" {
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

    # PORT, DATABASE_URI are injected by heroku
    config_vars {
        SECRET_KEY = "${var.secret-key}"
        GITHUB_CLIENT_ID = "${var.github-client-id}"
        GITHUB_CLIENT_SECRET = "${var.github-client-secret}"
        GITHUB_REDIRECT_URI = "${var.github-redirect-uri}"
    }

    buildpacks = [
      "heroku/python",
      "heroku/nodejs",
      "https://github.com/dpiddy/heroku-buildpack-runit.git",
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

resource "heroku_addon" "database" {
  app  = "${heroku_app.app.name}"
  plan = "heroku-postgresql:${var.database-plan}"
}
