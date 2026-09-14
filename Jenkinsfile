pipeline {
    agent any

    environment {
        FEEDBACK_FILE = 'feedback.txt'
        TEST_STATUS = 'NOT_RUN'
        TEST_SUMMARY = ''
    }

    stages {
        stage('Skip Jenkins Feedback Commit') {
            steps {
                script {
                    def commitMessage = bat(script: 'git log -1 --pretty=%%B', returnStdout: true).trim()
                    if (commitMessage.contains('[skip ci]')) {
                        currentBuild.result = 'NOT_BUILT'
                        error('Skipping Jenkins-generated feedback commit')
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                bat '''
                    if exist frontend\\package-lock.json (cd frontend && npm ci) else (cd frontend && npm install)
                    if exist backend\\package-lock.json (cd backend && npm ci) else (cd backend && npm install)
                '''
            }
        }

        stage('Run Automated Tests') {
            steps {
                script {
                    def frontendLint = bat(
                        script: 'cd frontend && npm run lint',
                        returnStatus: true
                    )
                    def frontendBuild = bat(
                        script: 'cd frontend && npm run build',
                        returnStatus: true
                    )
                    def backendTests = bat(
                        script: 'cd backend && npm test --if-present',
                        returnStatus: true
                    )

                    def failedChecks = []
                    if (frontendLint != 0) {
                        failedChecks.add('frontend lint')
                    }
                    if (frontendBuild != 0) {
                        failedChecks.add('frontend build')
                    }
                    if (backendTests != 0) {
                        failedChecks.add('backend tests')
                    }

                    env.TEST_STATUS = failedChecks.isEmpty() ? 'PASS' : 'FAIL'
                    env.TEST_SUMMARY = failedChecks.isEmpty()
                        ? 'Frontend lint, frontend build, and backend tests passed.'
                        : "Failed checks: ${failedChecks.join(', ')}."
                    if (!failedChecks.isEmpty()) {
                        currentBuild.result = 'FAILURE'
                    }
                }
            }
        }

        stage('Generate Feedback') {
            steps {
                bat 'node scripts\\generateFeedback.js'
                bat 'type %FEEDBACK_FILE%'
            }
        }

        stage('Commit Feedback') {
            steps {
                bat '''
                    git config user.name "Jenkins Bot"
                    git config user.email "jenkins@example.com"

                    git add %FEEDBACK_FILE%

                    git diff --cached --quiet || git commit -m "Jenkins: Update automated feedback [skip ci]"
                '''
            }
        }

        stage('Push Feedback to GitHub') {
            steps {
                script {
                    def targetBranch = env.BRANCH_NAME ?: 'main'
                    withCredentials([gitUsernamePassword(
                        credentialsId: 'github-token',
                        gitToolName: 'Default'
                    )]) {
                        bat "git push origin HEAD:${targetBranch}"
                    }
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'feedback.txt', fingerprint: true, allowEmptyArchive: true
        }
    }
}
