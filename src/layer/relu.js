'use strict';

import Base from './base';
import makeKernel from '../utilities/make-kernel';
import { relu, reluDerivative } from '../activation/relu';

export default class Relu extends Base {
  constructor(inputLayer, settings) {
    super(settings);

    this.inputLayer = inputLayer;

    inputLayer.setNextLayer(this);
  }

  setupKernels() {
    this.predictKernel = makeKernel(predict, {
      functions: [relu]
    });

    this.learnKernel = makeKernel(learn, {
      functions: [reluDerivative]
    });
  }

  predict() {
    this.outputs = this.predictKernel(this.inputLayer.outputs);
  }

  learn() {
    this.deltas = this.learnKernel(this.weights, this.errors);
  }
}

export function predict(inputs) {
  return relu(inputs[this.thread.y][this.thread.x]);
}

export function learn(weights, errors) {
  return reluDerivative(weights[this.thread.y][this.thread.x], errors[this.thread.y][this.thread.x]);
}