#!/usr/bin/env groovy

properties(
  [
    parameters([
      string(name: 'branch', defaultValue: 'develop', description: 'Branch name')
    ]),
    buildDiscarder(
      logRotator(
        artifactDaysToKeepStr: '10',
        artifactNumToKeepStr: '10',
        daysToKeepStr: '30',
        numToKeepStr: '20'
      )
    ),
  ]
)

currentBuild.displayName = params.branch

pipeline {
  tools {nodejs "node"}
    agent {
        node {
            label 'windows'
        }
    }
    stages {  
        stage("Build modules") {
          steps {
            sh 'npm config ls'
            dir('./container') {
                sh 'npm install --force'
                sh 'npm run build'
            }
            dir('./build') {
                sh "chmod +x -R ${env.WORKSPACE}"
                sh './jenkins_build_modules.sh' 
            }
          }
        } 
        stage("Build API") {
          steps {
            dir('./api') {
              bat 'nuget restore LMPlatform.sln'
              bat "\"${tool 'MSBuild'}\" LMPlatform.sln /p:Configuration=Release"
            }
          }
        }
      stage('Deploy') {
            steps {
                dir('./api') {
                    bat "\"${tool 'MSBuild'}\" LMPlatform.sln /p:Configuration=Release /p:DeployOnBuild=True /p:DeployDefaultTarget=WebPublish /p:WebPublishMethod=FileSystem /p:DeleteExistingFiles=True /p:publishUrl=/deploy/LMPlatform.UI"
                }
            }
        }
        stage("Run server") {
          steps { 
            dir('./server') {
              sh 'npm install --force'
            }
          }
        }
        // stage('Clean-up') {
        //     steps {
        //         sh  """#!/bin/bash
        //         rm -rf ./*
        //             """
        //     }
        // }
    }
}


