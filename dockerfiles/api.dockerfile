FROM python:3.7.2-slim

MAINTAINER Ju Lin <soasme@gmail.com>

ADD . /usr/src/app

RUN pip install -r /usr/src/app/requirements.txt

EXPOSE 5000

WORKDIR /usr/src/app

ENV PYTHONPATH=/usr/src/app

CMD gunicorn app:app --bind=0.0.0.0:5000
