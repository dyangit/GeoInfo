import json
import boto3
from boto3.dynamodb.conditions import Key, Attr


def lambda_handler(event, context):
    TABLE_NAME = "css436-Logging"
    BUCKET_NAME = "css436-test"
    ddb = boto3.resource('dynamodb', region_name="us-west-2").Table(TABLE_NAME)
    s3 = boto3.client("s3", region_name='us-west-2')
    loopBool = True

    while loopBool:
        if "queryStringParameters" in event.keys() and event["queryStringParameters"] != None and "username" in event[
            "queryStringParameters"].keys():
            filterExpression = Attr("username").eq(event["queryStringParameters"]["username"])
            items = ddb.scan(FilterExpression=filterExpression)
            count = 0;
            if items["Count"] == 0:
                return {
                    "statusCode": 200,
                    "body": "Deleted all items with username " + event["queryStringParameters"]["username"]
                }
            for item in items["Items"]:
                try:
                    ddb.delete_item(Key={'PID': item["PID"]})
                    count += 1
                except Exception as e:
                    pass
            object = s3.get_object(Bucket=BUCKET_NAME, Key="Input2.txt")
            logs = object["Body"].read().decode('utf-8').split("\n")
            updatedOutput = ""
            for log in logs:
                if not log.startswith('username' + event["queryStringParameters"]["username"]):
                    updatedOutput += log + "\n"
            try:
                s3.put_object(Bucket=BUCKET_NAME, Key="Input2.txt", ACL='public-read', Body=updatedOutput)
            except:
                return {
                    'statusCode': 400,
                    'body': "Failed to clear S3 object"
                }
            if count == 0:
                return {
                    'statusCode': 400,
                    'body': "Failed to clear DynamoDB"
                }
        else:
            loopBool = False
    return {
        'statusCode': 200,
        'body': 'Please give query attribute username with which to get log data for.'
    }
