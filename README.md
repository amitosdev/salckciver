# Slackciver
Get an HTTP request details in a slack channel.

## Usage
This module is meant to deploy with [Serverless framework](https://serverless.com) on AWS.

1. Make sure Serverless framework is installed and you set your AWS keys. You can use [SLS guide](https://serverless.com/framework/docs/providers/aws/guide/quick-start/).
2. Clone this repo.
3. Create Slack app token with `chat:write:bot` permissions.
4. Put the Slack token in the `serverless.yml` file.
5. Run `SLS deploy`

## Sending request
After deploying, you will gen an AWP API gatway adress:

```
https://foo123bar456.execute-api.us-east-1.amazonaws.com/prod/channel/{channelName}
```

Open a Slack channel and replace `{channelName}` in the url with the channel name.
You can now send *ANY* kind of an HTTP request with query stings / payload and see it in the channel.
