# AircallTechnicalExam

## Introduction

The objetive of this technical exam is to design, implement and unit-test a small business case.

Problem definition can be found [here](https://github.com/aircall/technical-test-pager): 

## How to execute
First of all, you need to install all dependencies:

```bash
npm install
```

This project doesn't have an executable main file, but you can run unit test with the following command:

```bash
npm run test
```

## What do I expect from persistence service

Problem definition states that if pager receives 2 alerts of the same system at the same time, only one notification must be sent.
The process to create a pager has two steps:

1. Check if there is pager with unhealthy status for a particular monitored service (read query).
2. If there is none, create a new pager with unhealthy status (write query). If there is one, don't do anything.

Problem is that if system receives two alerts of the same system at the same time, two alert processes will be started and these processes
could execute the fist step of the process at the same time resulting on both executing the second step. To address this problem, there is two solutions:

- Read and write lock: table/collection must be locked for reads and writes at the start of the process, so the first process which
adquires the lock will check that there is no pager and create a new one. After lock release, the second process will adquire the lock and
check that there is already a pager.
- Atomic operation: both steps are executed as a single operation, so the first process that executes the operation will create the pager
and the second one will fail.

One of these two solution is expected for "getOrCreateLastPager" method from Persistence Service. If the method creates a pager, "isNew" response property is set
to true. If the method simply returns an existing one, the propety is set to "false".