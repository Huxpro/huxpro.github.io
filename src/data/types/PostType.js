import {
	GraphQLObjectType as ObjectType,
	GraphQLString as StringType,
	GraphQLNonNull as NonNull,
	GraphQLList as List,
	GraphQLBoolean as BooleanType,
} from 'graphql'

const HeaderType = new ObjectType({
	name: 'header',
	fields: {
		title: {type: new NonNull(StringType)},
		tags: {type: new List(StringType)},
		image: {type: StringType},
		type: {type: StringType},
		subtitle: {type: StringType},
		author: {type: StringType},
		date: {type: StringType},
		headerMask: {type: StringType},
	},
});

const InitialType = new ObjectType({
	name: 'initial',
	fields: {
		catalog: {type: BooleanType},
	}
});

const PostType = new ObjectType({
	name: 'Post',
	fields: {
		path: {type: new NonNull(StringType)},
		content: {type: new NonNull(StringType)},
		header: {type: HeaderType},
		initial: {type: InitialType},
	},
});


export default PostType
