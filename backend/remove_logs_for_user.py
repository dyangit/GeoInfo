import json
import boto3
from boto3.dynamodb.conditions import Key, Attr


def lambda_handler(event, context):
    TABLE_NAME = "css436-Logging"
    BUCKET_NAME = "css436-test"
    ddb = boto3.resource('dynamodb', region_name="us-west-2").Table(TABLE_NAME)
    s3 = boto3.client("s3", region_name='us-west-2')
    loopBool = True

    if "queryStringParameters" in event.keys() and event["queryStringParameters"] != None and "username" in event[
        "queryStringParameters"].keys():
        removeAllFromDynamoDB(ddb, event["queryStringParameters"]["username"])
        object = s3.get_object(Bucket=BUCKET_NAME, Key="Input2.txt")
        logs = object["Body"].read().decode('utf-8').split("\n")
        updatedOutput = ""
        for log in logs:
            if not log.startswith('username: ' + event["queryStringParameters"]["username"]):
                updatedOutput += log + "\n"
        try:
            s3.put_object(Bucket=BUCKET_NAME, Key="Input2.txt", ACL='public-read', Body=updatedOutput)
            return {
                'statusCode': 200,
                'body': 'Cleared all entries for username: ' + event["queryStringParameters"]["username"]
            }
        except:
            return {
                'statusCode': 400,
                'body': "Failed to clear S3 object"
            }
    return {
        'statusCode': 200,
        'body': 'Please give query attribute username with which to get log data for.'
    }


def removeAllFromDynamoDB(ddb, username):
    loopBool = True
    filterExpression = Attr("username").eq(username)
    while loopBool:
        items = ddb.scan(FilterExpression=filterExpression)
        count = 0;
        if items["Count"] == 0:
            loopBool = False;
        for item in items["Items"]:
            try:
                ddb.delete_item(Key={'PID': item["PID"]})
                count += 1
            except Exception as e:
                pass
