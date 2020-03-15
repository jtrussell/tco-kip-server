import formatCardName from './formatCardName';

export default (name) => {
    if(!name) {
        return '';
    }

    return `https://crucible-tracker-card-images.s3.amazonaws.com/${formatCardName(name)}.png`;
};
