import {
	GraphQLSchema as Schema,
	GraphQLObjectType as ObjectType,
} from 'graphql'

import me from './queries/me'
import content from './queries/content'
import post from './queries/post'

const schema = new Schema({
	query: new ObjectType({
		name: 'Query',
		fields: {
			me,
			content,
			post,
		},
	}),
});

export default schema;
