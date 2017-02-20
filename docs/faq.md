# FAQ

- [Why do I need this?](#why)
- [I`m Windows User](#running-on-windows)
- [Supported Node Versions](#supported-node-versions)
- [How to deal with just created environment?](#how-to-deal-with-just-created-environment)
- [Which capabilities are available?](#which-capabilities-are-available)

Have a different question? Open an issue or pull request and we can add it here!

## Why?

The idea is to reduce the time that a developer/tester spent on environment provisioning and configuration. 

The set of predefined capabilities allows to easily manipulate created environment without additional knowledge of environment structure.

## Running on Windows

Since the connection between client and environment maintained over standard ssh connection Windows Users 
requires additionally install windows ssh client like [Cygwin](https://cygwin.com/install.html)   

## Supported Node Versions 

All versions of node.js ≥ 4.0 are supported.

## How to deal with the just created environment?

Type `n` on the first question.
Provide correct credential.
Waiting until the environment is finally provisioned.

> ***Note***: <br>
> Be really careful during credential providing. <br>
> According to [current limitation](kial.md) the tool have no chance to recognize credential correctness during this step.  

![image](https://cloud.githubusercontent.com/assets/5380167/23102868/e189c55e-f6b9-11e6-9593-20d6cae9b732.png)

## Which capabilities are available?

To list available capabilities visit [Functionality page](functionality.md). 