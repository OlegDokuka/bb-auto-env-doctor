# Functionality

- [Enhancing Environment creation](#enhance-environment-creation)
- [Managing application container](#managing-application-container)
- [Managing installed web applications](#managing-installed-web-applications)
- [Uploading WAR from Artifactory](#uploading-war-from-artifactory)
- [Uploading WAR from local file system](#uploading-war-from-local-file-system)


## Enhance Environment creation

The tool provides a simple mechanism of reducing the time of environment startup. 
The main goal that was reached is to stop Tomcat at first startup time. 
Somehow, this trick allows uploading cxp stack faster. 
Still, there is a misunderstanding in provisioning process tracking, so still, 
there is no way to determine whether or not the DBS stack is finally uploaded.


## Managing application container

Baedor provides several ways of managing installed application container. 
In this moment tool supports only Tomcat app container (further AC). 
The tool allows to stop/start AC, obtain information about container UP status 
and determine whether or not all installed applications are finally run. 
Currently, all these features are included in CLI flow and there are no way to run this capability 
independently (from the CLI side).


## Managing installed web applications

CLI tool allows easily listing and uninstalling undesirable/redundant web apps. 
As mentioned in the previous section this capability is a part of CLI flow.



## Uploading WAR from Artifactory

Baedor supports integration with JFrog and provides simple CLI API for searching and uploading 
required artifacts into a web container.


## Uploading WAR from local file system

If there are no required artifact on Artifactory, still, there is a way to upload a file from local file system. 
For now, it is quite non-interactive and you need to type file path without any clues from the CLI.  