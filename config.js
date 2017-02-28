module.exports = {
    JWT_SECRET: 'coldbrew',
    google: {
        clientID: '551088896204-68i3pnc78bssjhmgh0mk3ce8ng3ceebi.apps.googleusercontent.com',
        clientSecret: 'QX_peBNqb99jUbbRdWY6FYoQ',
        callbackURL: 'http://localhost:3000/apis/auth/google/callback'
    },
    facebook: {
        clientID: '1625413921096922',
        clientSecret: 'd31ad613f3c7642498dc214e3680d194',
        callbackURL: 'http://localhost:3000/apis/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'email']
    },
    googleMap: {
        apiKey: 'AIzaSyBXSf94vCunJOSd6IF38L0jGlqMaPFtMJI'
    }
};
