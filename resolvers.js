const {AuthenticationError} = require('apollo-server')

const Pin = require('./models/Pin');

//hard coded user
// const user = {
//     _id: "1",
//     name:"Ori",
//     email: "orisouchami1@gmail.com",
//     picture: ""

// };

const authenticated = next =>(root, args, ctx, info)=>{
    //ctx is context -we can finde it under server.js ===> const server = new ApolloServer({ typeDefs,resolvers,context: async ({req})=>{
    //ctx passing the currentUser - token and his google+ data
    if(!ctx.currentUser){
        throw new AuthenticationError('you must be logged in')
    }
    return next(root, args, ctx, info)
}



module.exports = {

    Query:{
        me: authenticated((root, args, ctx) => ctx.currentUser),
        getPins: async (root, args, ctx) =>{
           const pins =  await Pin.find({}).populate('author').populate('comments.author');
           return pins;
        }
    },
    Mutation: {
        createPin: authenticated( async (root, args, ctx) =>{
            const newPin = await new Pin({
                ...args.input,
                author: ctx.currentUser._id
            
            }).save()
           const pinAdded =  await Pin.populate(newPin, 'author')

           return pinAdded

        })

    }
};