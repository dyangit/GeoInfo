import json
import boto3
from boto3.dynamodb.conditions import Key, Attr

def lambda_handler(event, context):
    TABLE_NAME = "css436-Logging"
    BUCKET_NAME = "css436-test"
    s3 = boto3.client("s3", region_name="us-west-2")
    try:
        table = boto3.resource('dynamodb', region_name="us-west-2").Table(TABLE_NAME)
        scan = None

        with table.batch_writer() as batch:
            count = 0
            while scan is None or 'LastEvaluatedKey' in scan:
                if scan is not None and 'LastEvaluatedKey' in scan:
                    scan = table.scan(
                        ProjectionExpression="PID",
                        ExclusiveStartKey=scan['LastEvaluatedKey'],
                    )
                else:
                    scan = table.scan(ProjectionExpression="PID")

                for item in scan['Items']:
                    batch.delete_item(Key={"PID": item["PID"]})
                    count = count + 1
    except Exception as e:
        return {
            'statusCode': 400,
            'body': 'Failed to empty DynamoDB Table'
        }

    try:
        s3.put_object(Bucket=BUCKET_NAME, Key="Input2.txt", Body="", ACL='public-read')
    except:
        return {
            'statusCode': 400,
            'response': "failed to clear S3 object file."
        }
    return {
        'statusCode': 200
    }

