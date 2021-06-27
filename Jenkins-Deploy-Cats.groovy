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
    agent {
        node {
            label 'windows'
        }
    }
    stages {  
        stage("Build modules") {
          steps {
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


