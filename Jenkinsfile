pipeline {
    agent any
    stages {
        // stage('Build') {
        //     steps {
        //         echo 'Running build automation'
        //         sh './gradlew build --no-daemon'
        //         archiveArtifacts artifacts: 'dist/nodejs-app.zip'
        //     }
        // }
        stage('Build Docker Image') {
            when {
                branch 'master'
            }
            steps {
                script {
                    app = docker.build("vigneshcloud/jenkins-app")
                    app.inside {
                        sh 'echo $(curl localhost:8080)'
                    }
                }
            }
        }
        stage('Push Docker Image') {
            when {
                branch 'master'
            }
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'docker_hub_login') {
                        app.push("${env.BUILD_NUMBER}")
                        app.push("latest")
                    }
                }
            }
        }
        stage('DeployToProduction') {
            when {
                branch 'master'
            }
            steps {
                input 'Deploy to Production?'
                milestone(1)
                withCredentials([usernamePassword(credentialsId: 'webserver_login', usernameVariable: 'USERNAME', passwordVariable: 'USERPASS')]) {
                    script {
                        sh "sshpass -p 'VMwar3!!' -v ssh -o StrictHostKeyChecking=no cloud_user@$prod_ip \"docker pull vignesh/jenkins-app:${env.BUILD_NUMBER}\""
                        try {
                            sh "sshpass -p 'VMwar3!!' -v ssh -o StrictHostKeyChecking=no cloud_user@$prod_ip \"docker stop jenkins-app\""
                            sh "sshpass -p 'VMwar3!!' -v ssh -o StrictHostKeyChecking=no cloud_user@$prod_ip \"docker rm jenkins-app\""
                        } catch (err) {
                            echo: 'caught error: $err'
                        }
                        sh "sshpass -p 'VMwar3!!' -v ssh -o StrictHostKeyChecking=no cloud_user@$prod_ip \"docker run --restart always --name jenkins-app -p 8080:8080 -d vigneshcloud/jenkins-app:${env.BUILD_NUMBER}\""
                    }
                }
            }
        }
    }
}
