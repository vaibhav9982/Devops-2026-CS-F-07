pipeline {
    agent any

    stages {

        stage('Check Commit') {
            steps {
                script {
                    def commitMessage = bat(
                        script: 'git log -1 --pretty=%B',
                        returnStdout: true
                    ).trim()

                    echo "Latest commit: ${commitMessage}"

                    if (commitMessage.contains('[skip ci]')) {
                        currentBuild.result = 'NOT_BUILT'

                        error("Skipping Jenkins-generated commit")
                    }
                }
            }
        }


        stage('Generate Feedback') {
            steps {
                bat '''
                    node scripts\\generateFeedback.js
                '''
            }
        }


        stage('Show Feedback') {
            steps {
                bat '''
                    type feedback.txt
                '''
            }
        }


        stage('Commit Feedback') {
            steps {
                bat '''
                    git config user.name "Jenkins Bot"
                    git config user.email "jenkins@example.com"

                    git add feedback.txt

                    git diff --cached --quiet || git commit -m "Jenkins: Update automated feedback [skip ci]"
                '''
            }
        }


        stage('Push Feedback to GitHub') {
            steps {
                bat '''
                    git push origin main
                '''
            }
        }
    }
}
