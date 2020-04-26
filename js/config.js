/**
    Used with AWS Cognito
*/

window._config = {
    cognito: {
        userPoolId: 'us-west-2_ynSIU8T8p', // Found on the Pool details pafe of AWS Cognito e.g. us-east-2_uXboG5pAb
        userPoolClientId: '7043dav823s1m75cqovu6q1nuc', // Found by selecting App Clients on left nav-bar e.g. 25ddkmj4v6hfsfvruhpfi7n4hv
        region: 'us-west-2' // e.g. us-east-2
    },
    api: {
        invokeUrl: '' // e.g. https://rc7nyt4tql.execute-api.us-west-2.amazonaws.com/prod,
    }
};
