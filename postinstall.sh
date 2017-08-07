#!/bin/bash
curl -Ls https://git.io/sbt > sbt && chmod 0755 sbt

if [ -z "$OPENSHIFT_DATA_DIR" ]; then
    if [ ! -d "$OPENSHIFT_DATA_DIR/jdk" ]; then
      wget -qO- --no-check-certificate --no-cookies --header 'Cookie: oraclelicense=accept-securebackup-cookie' 'http://download.oracle.com/otn-pub/java/jdk/8u144-b01/090f390dda5b47b9b721c7dfaa008135/jdk-8u144-linux-x64.tar.gz' | tar -zxvf $OPENSHIFT_DATA_DIR && mv $OPENSHIFT_DATA_DIR/jdk1.8.0_144 $OPENSHIFT_DATA_DIR/jdk
    fi
fi

mkdir -p .sbt/launchers
mkdir -p .sbt/0.13.16
mkdir -p .sbt/boot
mkdir -p .ivy