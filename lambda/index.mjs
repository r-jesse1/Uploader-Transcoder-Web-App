import { S3Client, HeadObjectCommand } from @aws-sdkclient-s3;
import { SQSClient, SendMessageCommand } from @aws-sdkclient-sqs;
import { nanoid } from 'nanoid';


const s3Client = new S3Client({ region 'ap-southeast-2' });
const sqsClient = new SQSClient({ region ap-southeast-2 });
const QUEUE_URL = httpssqs.ap-southeast-2.amazonaws.com901444280953n11411911-A3-queue;

export const handler = async (event) = {
  console.log(S3 Event, JSON.stringify(event, null, 2));
  const newID = nanoid() + .mp4;
  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;

  
  try {
    const headParams = {
        Bucket bucket,
        Key key
    };
    
    const data = await s3Client.send(new HeadObjectCommand(headParams));
    console.log(data)
    console.log(data.Metadata)
    const metadata = data.Metadata;
    let privateVal = false
    if (metadata.private == true) {
        privateVal = true;
    }




      const jobMessage = {
        id metadata.id,
        progressID metadata.progressID,
        s3input uploads + metadata.id,
        s3vidOutput videos + newID,
        s3thumbOutput thumbnails + newID + .png,
        resolution 1920x1080,
        fileType mp4,
        user metadata.user,
        newID newID,
        private privateVal,
        name metadata.name,
        new true
    };

    const params = {
        QueueUrl QUEUE_URL,
        MessageBody JSON.stringify(jobMessage),
    };

    const command = new SendMessageCommand(params);
    const response = await sqsClient.send(command);


    console.log(`Transcoding job enqueued with progress ID ${metadata.progressID}`, response.MessageId);

  } catch (err) {
      console.log(Error getting object, err);
      return {
          statusCode 500,
          body JSON.stringify({
              message 'Error processing file',
              error err.message
          })
      };
  }
};