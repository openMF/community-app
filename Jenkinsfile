pipeline {
    
    agent any
    
    environment { 
        DOCKER_ID_USER =  credentials('docker-user')
        DOCKER_PASSWORD = credentials('docker-password')
        DOCKER_ENV="development"
        REGISTRY = credentials('docker-registry')
        HARBOR_NAMESPACE = credentials('docker-namespace')
        JAVA_HOME = '/usr/lib/jvm/zulu11-ca-amd64/'
        GIT_BRANCH = 'develop'
        GIT_URL = 'https://github.com/openMF/community-app.git'
        COMPANY = 'mifos'
        COMPANY_TYPE = 'org'
        COMPANY_BRAND = 'openbanking'
        COMPANY_PRODUCT = 'community_app'
        HANGOUT_TOKEN = credentials('hangout-token')
        GITHUB_CREDENTIAL_ID = credentials('github-fineract')
    }
    
    stages {    

        stage('Clean WorkSpace at the Begining'){
            steps {
                hangoutsNotify message: "Begin of Pipeline ${currentBuild.fullDisplayName}",token: "$HANGOUT_TOKEN",threadByJob: true    
                hangoutsNotify message: "Clean WorkSpace at the Begining",token: "$HANGOUT_TOKEN",threadByJob: true
                cleanWs()
                sh 'date'
                sh 'id'
                sh 'docker system prune -a --volumes --force'                
                hangoutsNotify message: "Success",token: "$HANGOUT_TOKEN",threadByJob: true            
            }
        }

        stage ('Clone GitHub Repository') {
            steps {
                hangoutsNotify message: "Clone GitHub Repository",token: "$HANGOUT_TOKEN",threadByJob: true
                git branch: "$GIT_BRANCH", credentialsId: "$GITHUB_CREDENTIAL_ID",  url: "$GIT_URL"
                hangoutsNotify message: "Success",token: "$HANGOUT_TOKEN",threadByJob: true            
            }
        }
        
        stage ('Build Docker Image') {
            steps {
                hangoutsNotify message: "Build Docker Image",token: "$HANGOUT_TOKEN",threadByJob: true
                sh 'docker build -t $COMPANY_TYPE.$COMPANY.$COMPANY_BRAND.$COMPANY_PRODUCT.$GIT_BRANCH . '                
                hangoutsNotify message: "Success",token: "$HANGOUT_TOKEN",threadByJob: true            
            }
        }

        stage ('Push Docker Image') {
            steps {
                hangoutsNotify message: "Push Docker Image",token: "$HANGOUT_TOKEN",threadByJob: true                  
                sh 'echo $DOCKER_PASSWORD | docker login $REGISTRY -u $DOCKER_ID_USER --password-stdin'                
                sh 'docker tag $COMPANY_TYPE.$COMPANY.$COMPANY_BRAND.$COMPANY_PRODUCT.$GIT_BRANCH $REGISTRY/$HARBOR_NAMESPACE/$COMPANY_TYPE.$COMPANY.$COMPANY_BRAND.$COMPANY_PRODUCT.$GIT_BRANCH'                
                sh 'docker push $REGISTRY/$HARBOR_NAMESPACE/$COMPANY_TYPE.$COMPANY.$COMPANY_BRAND.$COMPANY_PRODUCT.$GIT_BRANCH'                
                hangoutsNotify message: "Success",token: "$HANGOUT_TOKEN",threadByJob: true
            }
        }
    }
    
    post { 
        success { 
            hangoutsNotify message: "Clean WorkSpace at the End",token: "$HANGOUT_TOKEN",threadByJob: true  
            sh 'docker system prune -a --volumes -f'
            cleanWs()
            echo 'Success'
            hangoutsNotify message: "Finalizing the Pipeline of ${currentBuild.fullDisplayName}",token: "$HANGOUT_TOKEN",threadByJob: true
            hangoutsNotify message: "Completed build of : $GIT_URL Branch: $GIT_BRANCH",token: "$HANGOUT_TOKEN",threadByJob: false
        }
        failure { 
            hangoutsNotify message: "Clean WorkSpace at the End",token: "$HANGOUT_TOKEN",threadByJob: true  
            sh 'docker system prune -a --volumes -f'
            cleanWs()
            echo 'Error'
            hangoutsNotify message: "Error",token: "$HANGOUT_TOKEN",threadByJob: true
        }
    }
}
