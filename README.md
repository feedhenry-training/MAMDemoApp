Overview
==========

This app is to demostrate how to use $fh.auth API in a hybrid app built with FeedHenry platform. $fh.auth allows apps to authenticate and authorise users based on policies defined using the mobile application manangement product of the FeedHenry platform.

For details about the $fh.auth API, please check out the documentation [here](http://docs.feedhenry.com/v1/feedhenry-api.html#$fh.auth).

Setup
======

In this app, users can be authenticated by using their Google account or FeedHenry account. To do that, you need to setup the auth policies in the mobile application management product and associate the auth policies with the app.

## Create Auth Policies

- Login to the mobile application management page, click on "Auth Policies" link on the left hand side of the page, you will see a list of auth policies. 
- Click on the "Create" button to create a new auth policy.
- Name the policy "MyFeedHenryPolicy", and choose the type to be "FEEDHENRY" and save.
- Create another policy, name it "MyGooglePolicy" and choose the type to be "OAUTH2". To use google OAuth, you need to authorise API access by using [Google APIs Console](https://code.google.com/apis/console/). More details about this can be found [here](http://docs.feedhenry.com/v1/oauth_info.html).

## Create the app

* Fork this app, copy the url of the repo
* Login to the FeedHenry platform, select "Create An App", and "Create an App from a Git repository", then fill the repo information in the next step. Following the steps in the wizard to create the app.
* After the app is created, you will be brought to the app's management view. Select "Manage" -> "Details" option and copy the "App ID" field.

## Create the Store Item for the App and Associate It with Auth Policies

- Go back to the mobile application management page, select "Store Items" and choose to create a new one
- You can name the store item whatever you want, paste the "App Id" value copied from previous step to the "Auth Token" field. 
- Assign "MyFeedHenryPolicy" and "MyGooglePolicy" to the app using the Auth Policies swap selector.
- Go back to the "Apps" tab in the studio, open the "Editor" option, and open this file: __client/default/js/init.js__. At the beginning of this file, you should find a variable defined as "CLIENT_TOKEN". Replace the value for that variable to be the "Auth Token" of the store item.

## Build the App

* Now you can build the app from the studio and install it on the device.

Using the App
==============

Once the app is installed, you can update the auth policies and see the impact of the changes by login from the device. Everytime when a user tries to login to the platform, the app will show the result of the login and the detailed response on the second page. 

If the user login successfully, he/she will be able to store data to the device. If you send the "Kill Pill" signal by either marking data purge for the user or the device, the stored data will be deleted.  