/**
 * 
 */
/*global window*/

/*
 * Responsible for rendering a single timeline event with title & bar
 */

(function ($, $m) {
	'use strict';

	/*************************************************************************
	 * Default Cell Renderer class
	 *************************************************************************/
	/**
	 * @constructor
	 * @extends {$m.Renderer}
	 */
	var Renderer = function () {
	};
	Renderer.prototype = new $m.Renderer();

	/* Class definition ******************************************************/
	(function () {
		var stripe_public_key = '';

		Renderer.prototype.update = function (level) {
			var o1 = this;
			$m.Renderer.prototype.update.apply(o1, arguments);

			//
			// Render CATS markers
			//

			// Empty the bar of CATS markers whether the new bond will have them or not
			var $bar = o1.j.find('div.bar').empty();

			if ( o1.cell['cats'] ) {
				var width = $bar.width();
				$.each(o1.cell['cats'], function(index, cats) {
					var position = Math.floor((cats.start - o1.cell.start) / (o1.cell.end - o1.cell.start) * width);
					var href = '/bonds/' + cats['cloudpath'] + '.pdf';
					var title = cats['ca_type'];
					var rel = cats['doc_name'].split(".");
					var html = '<a class="cats blue" title="' + title + '" ';
					if(typeof cats['cloudpath'] == 'undefined'){
						html = html + ' href="#" rel="' + rel[0] +'"></a>';
					}
					else{
						html = html + ' href="' + href + '" target="_blank"></a>';
					}
					var $marker = $(html).css('left', position);
					$bar.append($marker);
				});
			}

			//
			// Render the detailed info if the cell is expanded
			//
			if ( o1.j.hasClass('expanded') ) {
				var isBase = typeof o1.cell._idParent === 'undefined';

				// Add the download button
				o1.makeButton(isBase, function (button) {

					var $info = o1.j.find('div.info').append(button);

					// get the user's cost code, store the download in the database, and open the document
					var getCostCodeAndOpen = function (postUrl, postData) {
						var $costCodeModal = $('#ccodeRequest').modal('show');
						$costCodeModal.off('click');

						$costCodeModal.on('click', '.btn.btn-primary', function (event) {
							event.preventDefault();

							var costCode = $costCodeModal.find('textarea').val();
							if ( !costCode )
								return;
							postData.costCode = costCode

							var bondWindow = window.open();

							$.ajax({
								url : postUrl,
								type : 'POST',
								data : postData,
								
								success : function () {
									bondWindow.location.replace('/bonds/' + postData.cloudpath + '.pdf');
									$costCodeModal.modal('hide');
								},

								error : function () {
									document.write('A critical error occurred.  Our support staff will work to fix the problem.<br><br>');
									var backButton = '<button onclick="window.location.href = \'/\';">Back to BondPDF</button>';
									document.write(backButton);
								}
							});
						});
					};

					// store the download in the database and open the document
					var open = function (postUrl, postData) {
						var bondWindow = window.open();

						$.ajax({
							url : postUrl,
							type : 'POST',
							data : postData,
							
							success : function () {
								bondWindow.location.replace('/bonds/' + postData.cloudpath + '.pdf');
							},

							error : function () {
								bondWindow.close();
								document.write('A critical error occurred.  Our support staff will work to fix the problem.<br><br>');
								var backButton = '<button onclick="window.location.href = \'/\';">Back to BondPDF</button>';
								document.write(backButton);
							}
						});
					};

					// add button click handlers
					$('.freeDownloadUnlimitedCostCode').on('click', function () {
						getCostCodeAndOpen('/freedownload', {
							cloudpath : o1.cell['cloudpath'],
							doc_id : o1.cell['cloudpath'].substring(o1.cell['cloudpath'].indexOf('/') + 1)
						});
					});
					
					$('.freeDownloadUnlimited').on('click', function () {
						open('/freedownload', {
							cloudpath : o1.cell['cloudpath'],
							doc_id : o1.cell['cloudpath'].substring(o1.cell['cloudpath'].indexOf('/') + 1),
							costCode : null
						});
					});

					$('.freeDownloadLimitedCostCode').on('click', function() {
						$('#freeDownloadConfirm').modal('show');

						$('#confirmFreeDownload').on('click', function () {
							$('#freeDownloadConfirm').modal('hide');
							getCostCodeAndOpen('/freedownload', {
								cloudpath : o1.cell['cloudpath'],
								doc_id : o1.cell['cloudpath'].substring(o1.cell['cloudpath'].indexOf('/') + 1)
							});
						});

						$('#cancelFreeDownload').on('click', function () {
							$('#freeDownloadConfirm').modal('hide');
						});
					});
					
					$('.freeDownloadLimited').on('click', function() {
						$('#freeDownloadConfirm').modal('show');

						$('#confirmFreeDownload').on('click', function () {
							$('#freeDownloadConfirm').modal('hide');
							open('/freedownload', {
								cloudpath : o1.cell['cloudpath'],
								doc_id : o1.cell['cloudpath'].substring(o1.cell['cloudpath'].indexOf('/') + 1),
								costCode : null
							});
						});
					});

					$('.purchaseButtonCostCode').on('click', function () {
						var handler = StripeCheckout.configure({
							key : stripe_public_key,
							token : function (token, args) {
								var $costCodeModal = $('#ccodeRequest').modal('show');
								$costCodeModal.off('click');

								$costCodeModal.on('click', '.btn.btn-primary', function (event) {
									event.preventDefault();

									var costCode = $costCodeModal.find('textarea').val();
									if ( !costCode )
										return;

									$.ajax({
										url : '/buypdf',
										type : 'POST',
										data : {
											cloudpath : o1.cell['cloudpath'],
											doc_id : o1.cell['cloudpath'].substring(o1.cell['cloudpath'].indexOf('/') + 1),
											token : token,
											costCode : costCode
										},
										
										success : function () {
											$costCodeModal.modal('hide');
											$('#purchaseSuccessful').modal('show');
										},

										error : function () {
											document.write('A critical error occurred.  Our support staff will work to fix the problem.<br><br>');
											var backButton = '<button onclick="window.location.href = \'/\';">Back to BondPDF</button>';
											document.write(backButton);
										}
									});
								});
							}
						});

						// Open Stripe checkout
						handler.open({
							name : 'BondPDF',
							description : '1 PDF (Â£' + (stripeChargeAmount / 100).toFixed(2) + ')',
							amount : stripeChargeAmount,
							currency : 'gbp'
						});
					});
					
					$('.purchaseButton').on('click', function () {
						var handler = StripeCheckout.configure({
							key : stripe_public_key,
							token : function (token, args) {
								$.ajax({
									url : '/buypdf',
									type : 'POST',
									data : {
										cloudpath : o1.cell['cloudpath'],
										doc_id : o1.cell['cloudpath'].substring(o1.cell['cloudpath'].indexOf('/') + 1),
										token : token,
										costCode : null
									},
									
									success : function () {
										$('#purchaseSuccessful').modal('show');
									},

									error : function () {
										document.write('A critical error occurred.  Our support staff will work to fix the problem.<br><br>');
										var backButton = '<button onclick="window.location.href = \'/\';">Back to BondPDF</button>';
										document.write(backButton);
									}
								});
							}
						});

						// Open Stripe checkout
						handler.open({
							name : 'BondPDF',
							description : '1 PDF (Â£' + (stripeChargeAmount / 100).toFixed(2) + ')',
							amount : stripeChargeAmount,
							currency : 'gbp'
						});
					});

					// Only add the metadata info if the cell doesn't have a parent, i.e. it is a CATS doc
					if ( isBase ) {
						if ( o1.cell['doc_type'] !== 'Base Prospectus' && o1.cell['doc_type'] !== 'Base Supplement') {
							$info
								.append(o1.makeLine('issue_date'))
								.append(o1.makeLine('amount_issued'))
								.append(o1.makeLine('bond_type'))
								.append(o1.makeLine('coupon_type'));
						} else {
							$info
								.append(o1.makeLine('issue_date'))
								.append(o1.makeLine('entity_name'))
								.append(o1.makeLine('country'))
								.append(o1.makeLine('sector'));
						}
					}
				});
			}

			if ( o1.cell['doc_type'] === 'Base Prospectus' || o1.cell['doc_type'] === 'Base Supplement') {
				o1.j.addClass('base');
			} else {
				o1.j.removeClass('base');
			}
		};

		Renderer.prototype.setPosition = function (xp, yp, xOffscreen) {
			var o1 = this;
			$m.Renderer.prototype.setPosition.apply(o1, arguments);

			if ( o1.keepTitleInView && o1.j.hasClass('expanded') ) {
				var margin = o1._$header.find('span.title').css('margin-left');
				// margin will come back as 'auto' as default in IE < 9
				if ( margin === 'auto' )
					margin = '0px';
				o1.j.find('div.body').css('margin-left', margin);
			}
		};

		Renderer.prototype.makeButton = function (float, cb) {

			if (!this.cell.cloudpath) {
				return cb($('<div/>')
					.css('float', float ? 'right' : '')
					.append(this.makeRequestButton()));
			} else {
				
				this.makeDownloadButton(function (button) {
					return cb($('<div/>')
						.css('float', float ? 'right' : '')
						.append(button));
				});
			}
		};

		Renderer.prototype.makeDownloadButton = function (cb) {

			var cloudpath = this.cell['cloudpath'];
			var doc_id_value = cloudpath.substring(cloudpath.indexOf('/') + 1);

			$.ajax({
				url : '/candownload',
				type : 'POST',
				data : { 'doc_id' : doc_id_value },
				dataType : 'json',

				success : function (result) {
					stripe_public_key = result.stripe_public_key;
					var costCode = result.costCode;

					if ( result.purchased ) {
						return cb($('<a href="/bonds/' + cloudpath + '.pdf" title="Open PDF" target="_blank"><img src="/img/pdficon_large.png"/></a>'));

					} else if ( result.downloadLimit < 0 ) {
						// the user has unlimited free downloads

						if ( costCode )
							return cb($('<input class="freeDownloadUnlimitedCostCode" type="image" src="/img/pdficon_large.png" title="Open PDF"></input>'));
						else
							return cb($('<input class="freeDownloadUnlimited" type="image" src="/img/pdficon_large.png" title="Open PDF"></input>'));

					} else if ( result.freeDownloadsUsed < result.downloadLimit ) {
						// the user has free downloads remaining, so ask them if they want to use a free download to download the document

						var freeDownloadConfirmHtml = '<div id="freeDownloadConfirm" class="modal">'
													+ '<div class="modal-header">'
													+ '<button type="button" class="close" data-dismiss="modal" '
													+ 'onclick="$(\'#freeDownloadConfirm\').modal(\'hide\');">Ã—</button>'
													+ '<h3>Free Download</h3></div>'
													+ '<div class="modal-body">'
													+ '<p>You have ' + (result.downloadLimit - result.freeDownloadsUsed)
													+ ' of ' + result.downloadLimit + ' free downloads remaining.  '
													+ 'Would you like to use a free download to download this document?</p>'
													+ '</div>'
													+ '<div class="modal-footer">'
													+ '<button type="button" class="btn" data-dismiss="modal" '
													+ 'onclick="$(\'#freeDownloadConfirm\').modal(\'hide\');">Cancel</button>'
													+ '<button id="confirmFreeDownload" type="button" class="btn btn-primary">Download</button>'
													+ '</div></div>';

						$('#freeDownloadConfirm').remove();
						$(document.body).append(freeDownloadConfirmHtml);

						/*
						if ( costCode ) {
							return cb($('<input class="freeDownloadLimitedCostCode" type="image" src="/img/pdficon_large.png" title="Open PDF"></input>'));
						}
						else
							return cb($('<input class="freeDownloadLimited" type="image" src="/img/pdficon_large.png" title="Open PDF"></input>'));
						*/

					} else {
						// the user has no free downloads remaining, so they must purchase the document
						
						var purchaseSuccessfulHtml = '<div id="purchaseSuccessful" class="modal">'
														+ '<div class="modal-header">'
														+ '<button type="button" class="close" data-dismiss="modal" '
														+ 'onclick="$(\'#purchaseSuccessful\').modal(\'hide\');">Ã—</button>'
														+ '<h3>Payment Successful</h3></div>'
														+ '<div class="modal-body">'
														+ '<p>Document purchase succeeded.  Click the button below to view the document.</p></div>'
														+ '<div class="modal-footer">'
														+ '<button type="button" class="btn" data-dismiss="modal" '
														+ 'onclick="$(\'#purchaseSuccessful\').modal(\'hide\');">Close</button>'
														+ '<a class="btn btn-primary" href="/bonds/' + cloudpath + '.pdf" target="_blank"'
														+ 'onclick="$(\'#purchaseSuccessful\').modal(\'hide\');">View Document</a></div></div>';

							$('#purchaseSuccessful').remove();
							$(document.body).append(purchaseSuccessfulHtml);

						/*
						if ( costCode )
							return cb($('<input class="purchaseButtonCostCode" type="image" src="/img/pdficon_large.png" title="Purchase PDF"></input>'));
						else
							return cb($('<input class="purchaseButton" type="image" src="/img/pdficon_large.png" title="Purchase PDF"></input>'));
						*/
					}
				},

				error : function (jqXHR, textStatus, errorThrown) {
					console.log('Error checking whether user can download document: ' + textStatus + ': ' + errorThrown + ': ' + jqXHR.responseText);
					document.write(jqXHR.responseText + '<br><br>');
					var backButton = '<button onclick="window.location.href = \'/\';">Back to BondPDF</button>';
					document.write(backButton);

					return cb($(jqXHR.responseText));
				}
			});
		};

		Renderer.prototype.makeRequestButton = function () {
			return $('<button class="btn doc-request"><i class="icon-file"></i>Request PDF</button>');
		};

		function capitalize(str) {
			return str.replace(/[^\s]+/g, function (str) {
				return str.substr(0, 1).toUpperCase() + str.substr(1).toLowerCase();
			});
		}

		Renderer.prototype.makeLine = function (field) {
			var label = capitalize(field.replace('_', ' ')) + ': ';
			return $('<div/>')
				.text(this.cell[field])
				.prepend($('<b/>').text(label));
		};

	})();

	/*************************************************************************
	 * Default Cell Renderer Kind class
	 *************************************************************************/

	/**
	 * Used for displaying a single event in the map band. Bar only.
	 * @constructor
	 * @extends {$m.RendererKind}
	 */
	var RendererKind = function () {
	};
	RendererKind.prototype = new $m.RendererKind();

	RendererKind.prototype.Y_ROW_HEIGHT = 14;

	/* Class definition ******************************************************/
	(function () {

		/** @override */
		RendererKind.prototype.sName = 'bond';

		/** @override */
		RendererKind.prototype.Renderer = Renderer;
		/** @override */
		RendererKind.prototype.willAccept = function (cell) {
			return !!cell['kind'];
		};

		/** @override */
		RendererKind.prototype.mb = function (cell) {
			// Start off with the padding height
			return 250;
		};

		/** @override */
		RendererKind.prototype.estimateInfoHeight = function (cell, xWidth) {
			// Start off with the padding height
			return 4 * this.Y_ROW_HEIGHT;
		};
	})();

	$m.BondRendererKind = RendererKind;
})(window.jQuery, window.jQuery.fn.maziraTimeline);