import { test } from 'node:test'
import assert from 'node:assert/strict'
import { selectEmailRecipients } from './email-recipients'

test('verified sender preserves requested recipients without empty or duplicate entries', () => {
  assert.deepEqual(selectEmailRecipients([' a@example.invalid ', '', 'a@example.invalid', 'b@example.invalid'], 'events@example.invalid'), ['a@example.invalid', 'b@example.invalid'])
})

test('test sender sends only to the explicitly configured mailbox when it was requested', () => {
  assert.deepEqual(selectEmailRecipients(['student@example.invalid', 'owner@example.invalid'], 'onboarding@resend.dev', 'owner@example.invalid'), ['owner@example.invalid'])
})

test('test sender never reroutes an unrelated recipient to the owner', () => {
  assert.deepEqual(selectEmailRecipients('student@example.invalid', 'onboarding@resend.dev', 'owner@example.invalid'), [])
})

test('test sender without explicit mailbox configuration sends to nobody', () => {
  assert.deepEqual(selectEmailRecipients('student@example.invalid', 'onboarding@resend.dev'), [])
})

test('test mailbox comparison ignores case and surrounding configuration whitespace', () => {
  assert.deepEqual(selectEmailRecipients('Owner@example.invalid', 'onboarding@resend.dev', ' owner@example.invalid '), ['Owner@example.invalid'])
})
