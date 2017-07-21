
libraryDependencies += "org.scala-js" %%% "scalajs-dom" % "0.9.2"


lazy val commonSettings = Seq(
  organization := "com.example",
  version := "0.1.0-SNAPSHOT",
  scalaVersion := "2.12.2",
  skip in packageJSDependencies := true,
  unmanagedBase := baseDirectory.value / "../lib",
  scalaJSUseMainModuleInitializer := true,
  artifactPath in fastOptJS := sourceDirectory.value / "fastopt.js", //TODO: It's not working D=, it was working earlier !
  fork in fastOptJS := true,
  fork in compile := true
)

lazy val sketch00 = (project in file("sketch00"))
.settings(
  commonSettings
)
.enablePlugins(ScalaJSPlugin)

lazy val sketch01 = (project in file("sketch01"))
.settings(
  commonSettings
)
.enablePlugins(ScalaJSPlugin)

lazy val sketch02 = (project in file("sketch02"))
.settings(
  commonSettings
)
.enablePlugins(ScalaJSPlugin)

lazy val sketch03 = (project in file("sketch03"))
.settings(
  commonSettings
)
.enablePlugins(ScalaJSPlugin)

lazy val sketch04 = (project in file("sketch04"))
.settings(
  commonSettings
)
.enablePlugins(ScalaJSPlugin)

lazy val sketch05 = (project in file("sketch05"))
.settings(
  commonSettings
)
.enablePlugins(ScalaJSPlugin)

lazy val sketch06 = (project in file("sketch06"))
.settings(
  commonSettings
)
.enablePlugins(ScalaJSPlugin)

lazy val sketch07 = (project in file("sketch07"))
.settings(
  commonSettings
)
.enablePlugins(ScalaJSPlugin)

lazy val sketch08 = (project in file("sketch08"))
.settings(
  commonSettings
)
.enablePlugins(ScalaJSPlugin)

lazy val sketch09 = (project in file("sketch09"))
.settings(
  commonSettings
)
.enablePlugins(ScalaJSPlugin)