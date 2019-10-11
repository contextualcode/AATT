// Copyright 2013 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

module('FocusableElementNotVisibleAndNotAriaHidden', {
  setup: function() {
    var fixture = document.createElement('div');
    document.getElementById('qunit-fixture').appendChild(fixture);

    this.fixture_ = fixture;
    fixture.style.top = 0;
    fixture.style.left = 0;
  }
});

test('a focusable element that is visible passes the audit', function(assert) {
  var input = document.createElement('input');

  this.fixture_.appendChild(input);

    var config = {
        scope: this.fixture_,
        ruleName: 'focusableElementNotVisibleAndNotAriaHidden',
        elements: [],
        expected: axs.constants.AuditResult.PASS
    };
    assert.runRule(config);
});

test('a focusable element that is hidden fails the audit', function(assert) {
  var input = document.createElement('input');
  input.style.opacity = '0';

  this.fixture_.appendChild(input);

    var config = {
        scope: this.fixture_,
        ruleName: 'focusableElementNotVisibleAndNotAriaHidden',
        elements: [input],
        expected: axs.constants.AuditResult.FAIL
    };
    assert.runRule(config);
});

test('an element with negative tabindex and empty computed text is ignored', function(assert) {
  var emptyDiv = document.createElement('div');
  emptyDiv.tabIndex = '-1';
  this.fixture_.appendChild(emptyDiv);

    var config = {
        scope: this.fixture_,
        ruleName: 'focusableElementNotVisibleAndNotAriaHidden',
        expected: axs.constants.AuditResult.NA
    };
    assert.runRule(config);
});

