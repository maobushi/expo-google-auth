import React from 'react';
import renderer from 'react-test-renderer';
import { Text, View } from 'react-native';

describe('Example Test', () => {
  it('has 1 child', () => {
    const tree = renderer.create(
        <View>
            <Text>Hello</Text>
        </View>
    ).toJSON();
    // @ts-ignore
    expect(tree.children.length).toBe(1);
  });

  it('works', () => {
    expect(1).toBe(1);
  });
});

