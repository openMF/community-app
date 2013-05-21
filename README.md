# prototype-app

Repository for putting prototype work from Thoughtworks HSP around building single page web app

## Background

The Mifos project (<a target="_blank" href="http://www.mifos.org/about">http://www.mifos.org/about</a>) was originally setup and guided by <a target="_blank" href="http://www.grameenfoundation.org/">Grameen Foundation</a>. It has been open source since inception but in recent years the community for open source microfinance (http://www.openmf.org) took over maintanance and future development of the Mifos project.

Whilst the community continues to maintain and support the <a target="_blank" href="https://github.com/mifos/head">original Mifos MIS project</a>, most development has shifted to the <a target="_blank" href="https://github.com/openMF/mifosx">Mifos X project</a>.

## Mifos X

Mifos X is a MIS platform for microfinance. Its capabilities are exposed through a RESTful API.

 - Github Project Page: <a target="_blank" href="https://github.com/openMF/mifosx">https://github.com/openMF/mifosx</a>
 - Reference App Project Page: <a target="_blank" href="https://github.com/openMF/mifosx-community-apps">https://github.com/openMF/mifosx-community-apps</a>
 - Online Demo Reference App: <a target="_blank" href="https://demo.openmf.org/">https://demo.openmf.org/</a> - log on using username/password of mifos/password
 - Online Demo API Documentation: <a target="_blank" href="https://demo.openmf.org/api-docs/apiLive.htm">https://demo.openmf.org/api-docs/apiLive.htm</a>
 - Online Demo API (Example call): <a target="_blank" href="https://demo.openmf.org/mifosng-provider/api/v1/offices?tenantIdentifier=default&pretty=true">https://demo.openmf.org/mifosng-provider/api/v1/offices?tenantIdentifier=default&pretty=true</a> - log on using username/password of mifos/password

## Scope of Work

For the prototype the following scenarios should suffice:

### 1 Navigate to Role-based landing screen after login

This scenario will involve:
  - provide login screen that will use platform authentication api (<a target="_blank" href="https://demo.openmf.org/api-docs/apiLive.htm#authentication">https://demo.openmf.org/api-docs/apiLive.htm#authentication</a>)
  - on failure handle error response from platform authentication api 
  - on success display appropriate screen based on the roles associated with authenticated user.

Existing users on demo server:
 - mifos/passowrd has a 'Super user' role 
 - joejoe/password has a 'Branch Manager' role
 - jackjack/password has a 'Funder' role

Authentication API response
```JSON
{
  "username": "mifos",
  "userId": 1,
  "base64EncodedAuthenticationKey": "bWlmb3M6cGFzc3dvcmQ=",
  "authenticated": true,
  "roles": [
    {
      "id": 1,
      "name": "Super user",
      "description": "This role provides all application permissions."
    }
  ],
  "permissions": [
    "ALL_FUNCTIONS"
  ]
}
```

On each of the different landing screens for 'Super user', 'Branch Manager' and 'Funder' role it would suffice to just indicate that these are different screens through static content. If you wish you can invoke different platform API calls on each of the different landing pages e.g.
 - 'Super user' -> show all offices through https://demo.openmf.org/api-docs/apiLive.htm#offices_list
 - 'Branch Manager' -> show all clients through https://demo.openmf.org/api-docs/apiLive.htm#clients_list
 - 'Funder' -> show all funds through https://demo.openmf.org/api-docs/apiLive.htm#funds_retrieve


### 2 CRUD screens around typical administrative area like users

Implement CRUD behaviour around the users resource (https://demo.openmf.org/api-docs/apiLive.htm#users)

## Objective

The objective of this prototype/spike is to demonstrate a clean way of developing a single page app which exhibits the following qualities:

1. Structured Approach
2. Automation of dev code into production artifacts
3. Localisation and Internationalisation
4. Customisable and Extensible
