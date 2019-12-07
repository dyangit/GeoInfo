import json
import boto3
from boto3.dynamodb.conditions import Key, Attr


def lambda_handler(event, context):
    TABLE_NAME = "css436-Logging"
    ddb = boto3.resource('dynamodb', region_name="us-west-2").Table(TABLE_NAME)
    res = {
        "Query-Requirement": "Please give query attribute username with which to get log data for."
    }

    if event["queryStringParameters"] is not None and event["queryStringParameters"]["username"] is not None:
        filterExpression = Attr("username").eq(event["queryStringParameters"]["username"])
        items = ddb.scan(FilterExpression=filterExpression)

        return {
            'statusCode': 200,
            'body': json.dumps(items["Items"])
        }

    return {
        'statusCode': 200,
        'body': "Empty"
    }
