import json
import boto3

def lambda_handler(event, context):
    TABLE_NAME = "css436-Logging"
    BUCKET_NAME = "css436-test"
    ddb = boto3.client("dynamodb", region_name='us-west-2')
    s3 = boto3.client("s3", region_name="us-west-2")

    res = {
        "Query-Requirement": "Please give a query with minimum required attribute: PID"
    }
    if event["queryStringParameters"] is not None:
        item = s3.get_object(Bucket=BUCKET_NAME, Key="Input2.txt")
        s3_update_string = "username: " + event["queryStringParameters"]["username"] + " "
        innerRequest = {'Item': {}}
        for attribute in event["queryStringParameters"]:
            if(attribute != "username"):
                s3_update_string = s3_update_string + attribute + ": " + event["queryStringParameters"][attribute] + " "
                print(s3_update_string)
            innerRequest["Item"][attribute] = {
                 "S":event["queryStringParameters"][attribute]
            }
        res = ddb.put_item(TableName=TABLE_NAME, Item=innerRequest['Item'])
        s3.put_object(Bucket=BUCKET_NAME, Key="Input2.txt", Body=item["Body"].read().decode('utf-8') + s3_update_string + "\n", ACL='public-read')
    return {
            'statusCode': 200,
            'body': json.dumps(res)
        }
