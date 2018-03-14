'use strict';

const sinon = require('sinon');
const test = require('ava');

const migrateNewResources = require('../lib/migrate-new-resources');

test.beforeEach(t => {
	t.context = Object.assign({ resourceMigrations: {} }, { migrateNewResources }, {
		config: {
			perType: true
		},
		serverless: {
			config: {
				servicePath: __dirname
			}
		},
		getStackName: () => 'test',
		migrate: sinon.stub()
	});
});

test('calls migrate for matching resources', t => {
	t.context.resourcesById = {
		Foo: {
			Type: 'AWS::NotMatch'
		},
		Bar: {
			Type: 'AWS::Logs::SubscriptionFilter'
		}
	};

	t.context.migrateNewResources();
	t.true(t.context.migrate.calledOnce);
});

test('does not call migrate for already migrated resources', t => {
	t.context.resourceMigrations.Bar = {};
	t.context.resourcesById = {
		Foo: {
			Type: 'AWS::Logs::SubscriptionFilter'
		},
		Bar: {
			Type: 'AWS::Logs::SubscriptionFilter'
		}
	};

	t.context.migrateNewResources();
	t.true(t.context.migrate.calledOnce);
});
