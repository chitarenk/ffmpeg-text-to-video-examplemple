const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

// JSON data containing video settings
// const InputVideos = [
//     {
//         text: 'For God so loved the world that he gave his one and only Son, '
//         +
//         'that whoever believes in him shall not perish but have eternal life.',
//         duration: 10
//     },
//     {
//         text: 'For I know the plans I have for you,” declares the LORD, “plans to prosper you and not to harm you, plans to give you hope and a future. ',
//         duration: 10
//     },
// ];

const InputVideos = [
    {
        textfile: 'line1.txt',
        duration: 10
    },
    {
        textfile: 'line2.txt',
        duration: 10
    },
];

// Font settings
const fontSize = 22;
const fontColor = 'black';

// Output directory for videos
const outputDirectory = 'output/';

// Function to generate videos
const generateVideos = async () => {
    for (let i = 0; i < InputVideos.length; i++) {
        const videoSetting = InputVideos[i];
        const { textfile, duration } = videoSetting;
        const videoName = `video_${i}.mp4`;
        const videoPath = outputDirectory + videoName;

        await new Promise((resolve, reject) => {
            ffmpeg()
                .input(`color=c=Orange:s=640x480:d=${duration}`)
                .inputFormat('lavfi')
                .complexFilter([
                    `drawtext=fontsize=${fontSize}:fontcolor=${fontColor}:x=(w-tw)/2:y=(h-th)/2:textfile=${textfile}`,
                ])
                .outputFPS(25)
                .outputOptions('-pix_fmt', 'yuv420p')
                .output(videoPath)
                .duration(10)
                .on('end', () => {
                    console.log(`Video ${i} created.`);
                    resolve();
                })
                .on('error', (err) => {
                    console.error(`Error creating video ${i}:`, err);
                    reject(err);
                })
                .run();
        });
    }
};

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory);
}

// Generate videos
generateVideos()
    .then(() => {
        console.log('All videos created successfully.');
    })
    .catch((err) => {
        console.error('Error generating videos:', err);
    });