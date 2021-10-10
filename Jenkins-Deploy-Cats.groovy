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
            bat  'npm config ls'
            dir('./container') {
				bat  'npx rimraf ./node_modules'
                bat  'npm rimraf ./package-lock.json'
                bat  'npm install --force'
                bat  'npm run build:prod'
            }
            dir('./build') {
                bat  "chmod +x -R ${env.WORKSPACE}"
                bat  './jenkins_build_modules.sh' 
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
              bat 'npm install --force'
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


