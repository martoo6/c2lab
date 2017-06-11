#!/bin/bash

SCALA_VERSION="2.12.2"
SBT_PLUGINS="$HOME/.sbt/0.13/plugins"
SBT_PLUGINS_FILE="$SBT_PLUGINS/plugins.sbt"
CURRENT_DIR="$(pwd -P)"
INSTALL_LOG="$CURRENT_DIR/install.log"


info(){
    echo "[-] $@"
}
error() {
    echo "[!] $@"
}

PATH=$PATH:$(readlink -f .)

export JDK_HOME="$JAVA_HOME"
JAVA="$JAVA_HOME/bin/java"

info "Installing oracle JDK"
      (wget -qO- --no-check-certificate --no-cookies --header "Cookie: oraclelicense=accept-securebackup-cookie" http://download.oracle.com/otn-pub/java/jdk/8u131-b11/d54c1d3a095b4ff2b6607d096fa80163/jdk-8u131-linux-x64.tar.gz | tar zxf -) &
PID_JAVA=$!

info "installing SBT"

wget -q https://raw.githubusercontent.com/paulp/sbt-extras/master/sbt && chmod 0755 ./sbt
mkdir -p .sbt/launcher
mkdir -p .sbt/boot 
mkdir -p .ivy2

info "Installing Ensime."
wget -q "http://ensime.typelevel.org/ensime_2.12-2.0.0-M1-assembly.jar" &
PID_ENSIME=$!

if [ $PID_JAVA ] ; then
  info "Waiting for java to finsh download."
  wait $PID_JAVA
fi

info "Using JDK at $JAVA_HOME"

PATH=$PATH:$(readlink -f "$JAVA_HOME/bin")

info "Installing SBT and Coursier. This will take a while."
mkdir -p "coursier-dummy-project"
mkdir -p "coursier-dummy-project"/project
echo "" > coursier-dummy-project/build.sbt
echo 'addSbtPlugin("io.get-coursier" % "sbt-coursier" % "1.0.0-RC3")' > coursier-dummy-project/project/plugins.sbt
echo "sbt.version=0.13.15" > coursier-dummy-project/project/build.properties

pushd coursier-dummy-project &>/dev/null
cat <<EOF > "build.sbt"
name := "coursier-dummy-project"

version := "1.0"

scalaVersion := "2.12.2"
EOF

#THIS IS NECESARY AS COURSIER SET THE CACHE IN FORBIDDEN DIRECTORY BY DEFAULT
export COURSIER_CACHE="$(pwd)/../.coursier-cache"
sbt -sbt-dir ../.sbt/ -sbt-boot ../.sbt/boot -ivy ../.ivy2 -sbt-version 0.13.15 -sbt-launch-dir ../.sbt/launchers -java-home ../jdk1.8.0_131 compile  > "$INSTALL_LOG" 2>&1
popd &>/dev/null

rm -rf coursier-dummy-project

#TODO: UPLOAD TO GITHUB REPOSITORY AND THEN DOWNLOAD THE VERSIONATED FILES
#info "Configuring examples. This may take a while..."
#FOLDS="templates/ examples/"
#for F in $FOLDS; do
#    pushd $F &>/dev/null
#    for D in $(ls -d */); do
#        pushd $D &>/dev/null
#        info "Building $(pwd)"
#        #Parallel and save in a list of PIDs an check that all of them are finished ?
#        sbt "ensimeConfig" >>"$INSTALL_LOG" 2>&1
#        popd &>/dev/null
#    done
#    popd &>/dev/null
#done

info "Waiting for Ensime to finish download.."
wait $PID_ENSIME
wait

info "Done!"

