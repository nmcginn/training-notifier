'use strict';

const moment = require('moment');
const AWS = require('aws-sdk');
const S3 = new AWS.S3();

const bucketName = 'what-matters-is-looking-cool';
const trainingSites = [
    {"name": "warriorpoetsociety", "uri": "https://warriorpoetsociety.us/training/"},
    {"name": "therange", "uri": "https://www.therangestl.com/TRAINING.aspx"}
    // TODO: moar
];

/*
    bucket/
    bucket/name/
    bucket/name/latest
*/

const fetchPreviousSiteRun = async (site) => {
    try {
        return await S3.getObject({Bucket: bucketName, Key: `${site.name}/latest`}).promise();
    }
    catch(err) {
        if (err && err.code && err.code === 'NoSuchKey')
            return {
                page: null,
                hash: null,
                persist: true,
                modified: moment().toString()
            };
        return err;
    }
}

exports.handler = async function(event, context) {
    const sites = trainingSites.map(site => fetchPreviousSiteRun(site));
    const latest = await Promise.all(sites);

    // TODO: compare current site state to cached
    // TODO: send notification for updated site states
    // TODO: persist any updated site states to S3

    return latest;
}
