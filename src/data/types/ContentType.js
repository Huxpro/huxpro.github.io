import {
	GraphQLObjectType as ObjectType,
	GraphQLString as StringType,
	GraphQLNonNull as NonNull,
} from 'graphql';

const ContentType = new ObjectType({
	name: 'Content',
	fields: {
		path: {type: new NonNull(StringType)},
		title: {type: new NonNull(StringType)},
		content: {type: new NonNull(StringType)},
		component: {type: new NonNull(StringType)},
	},
});

export default ContentType;
