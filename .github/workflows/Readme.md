# Purpose of Automation
In this automation workflow the whenever there is a new commit on the develop branch it is going to
 - build it 
 - deploy to the AWS S3 which is a file storage system
 - Invalidate the Cache on Cloudfront
For build we are doing it the same way it is specified in the official repository of MIFOS and once the build is done and its is uploaded to S3 we are 
invalidating the current files on the AWS Cloudfront so that it can pull up the new files that are present over in the S3 this step takes some time so once commit is done 
it will take around 5 mins to view the changes on the Final website that is

<br /> https://enterprise-ui.fiter.io <br />

If one needs to create an extra envrionment for its deployment , after creating the cloudfront and doing all the specification we will need to create a subdomain over 
there and then we can map it to the origin present in the Cloudfront .
## The architechture looks like this on the AWS side
<img width="566" alt="Screenshot 2022-03-09 at 11 26 01 AM" src="https://user-images.githubusercontent.com/12393562/157381244-665c732b-508c-46eb-bcff-e9ab7fb0b3ce.png">
