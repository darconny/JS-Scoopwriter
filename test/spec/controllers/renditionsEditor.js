'use strict';

/**
* Module with tests for the RenditionsEditorCtrl controller.
*
* @module RenditionsEditorCtrl tests
*/

describe('Controller: RenditionsEditorCtrl', function () {
    var articleService,
        renditionsEditorCtrl,
        $httpBackend,
        $modal;

    beforeEach(module('authoringEnvironmentApp'));

    beforeEach(inject(function (
        $controller, _$modal_, _$httpBackend_, $q, $templateCache, article
    ) {
        var modalTemplate;

        $httpBackend = _$httpBackend_;
        $modal = _$modal_;
        articleService = article;

        articleService.articleInstance = {
            articleId: 123,
            language: 'de',
            languageData: {
                id: 5,
                name: 'German'
            }
        };

        spyOn($modal, 'open').andCallThrough();
        modalTemplate = $templateCache.get(
            'app/views/modal-renditions-editor.html');
        $httpBackend.whenGET('views/modal-renditions-editor.html')
            .respond(200, modalTemplate);

        renditionsEditorCtrl = $controller('RenditionsEditorCtrl', {
            article: articleService,
            $modal: $modal
        });
    }));

    describe('openRenditionsEditor() method', function () {
        it('opens a modal with correct parameters', function () {
            var callArgs,
                expectedArticleInfo;

            renditionsEditorCtrl.openRenditionsEditor();

            expect($modal.open).toHaveBeenCalled();
            callArgs = $modal.open.mostRecentCall.args[0];

            expect(callArgs.templateUrl).toEqual(
                'views/modal-renditions-editor.html');
            expect(callArgs.controllerAs).toEqual('modalRenditionsCtrl');

            expectedArticleInfo = {
                articleId: 123,
                languageId: 5
            };
            expect(callArgs.resolve.articleInfo())
                .toEqual(expectedArticleInfo);
        });
    });

    describe('modal\'s controller', function () {
        var ctrl,
            fakeModalInstance;

        beforeEach(function () {
            var articleInfoParam,
                fakeSCE,
                ModalCtrl;

            renditionsEditorCtrl.openRenditionsEditor();

            // XXX: this is not ideal, since obtaining a reference to the
            // modal controller depends on the openPreview() method to provide
            // a correct controller parameterto the $modal.open() ... but on
            // the other hand, is there a good alternative on how to obtain
            // that reference?
            ModalCtrl = $modal.open.mostRecentCall.args[0].controller;

            fakeModalInstance = {
                close: jasmine.createSpy()
            };

            fakeSCE = {
                trustAsResourceUrl: function (url) {
                    return url;
                }
            };

            articleInfoParam = {
                articleId: 111,
                languageId: 5
            };

            ctrl = new ModalCtrl(fakeModalInstance, fakeSCE, articleInfoParam);
        });

        it('exposes correct preview URL', function () {
            var expectedUrl = [
                'http://server.net',
                '/admin/image/article',
                '/article_number/111',
                '/language_id/5'
            ].join('');

            expect(ctrl.url).toEqual(expectedUrl);
        });

        describe('close() method', function () {
            it('closes the modal', function () {
                ctrl.close();
                expect(fakeModalInstance.close).toHaveBeenCalled();
            });
        });
    });

});
