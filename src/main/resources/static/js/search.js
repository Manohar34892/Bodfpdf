/**
 * 
 *//*
global window, document, setTimeout, isNaN, Date
*//**
 * $.parseParams - parse query string paramaters into an object.
 *//*
(function ($) {
	var re = /([^&=]+)=?([^&]*)/g;
	var decodeRE = /\+/g; // Regex for replacing addition symbol with a space
	var decode = function (str) {
		return decodeURIComponent(str.replace(decodeRE, " "));
	};
	$.parseParams = function (query) {
		var params = {}, e;
		while ( e = re.exec(query) ) {
			var k = decode(e[1]), v = decode(e[2]);
			if ( k.substring(k.length - 2) === '[]' ) {
				k = k.substring(0, k.length - 2);
				(params[k] || (params[k] = [])).push(v);
			}
			else params[k] = v;
		}
		return params;
	};
})(jQuery);

var filters = {};
var items = null;


var runQuery = (function () {
	*//**
	 * Returns a date given a date string. Can optionally round up.
	 * @param {string} sDate
	 * @param {boolean=} bRoundUp
	 * @returns {Date}
	 * @private
	 *//*
	function _parseDate(sDate, bRoundUp) {
		var tokens = sDate.split('-');

		var date = new Date();
		date.setUTCFullYear(tokens[0]);
		date.setUTCMonth(tokens[1] - 1);
		// Months are 0 indexed
		date.setUTCDate(tokens[2]);

		date.setUTCHours(bRoundUp ? 23 : 0);
		date.setUTCMinutes(bRoundUp ? 59 : 0);
		date.setUTCSeconds(bRoundUp ? 59 : 0);

		return date;
	}

	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	function _formatDate(date) {
		return date.getUTCDate() + ' ' + months[date.getUTCMonth()] + ' ' + date.getUTCFullYear();
	}

	function _numberWithCommas(x) {
		var parts = x.toString().split(".");
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		return parts.join(".");
	}

	function _alert(title, message, error) {
		var method = error ? 'addClass' : 'removeClass';
		$('#alert')[method]('alert-error')
			.find('h2').text(title).end()
			.find('p').text(message).end()
			.show();
	}

	function _processStartEnd(doc, startProp, endProp) {
		var start = doc[startProp];
		if ( !start ) {
			doc[startProp] = 'unknown';
			//doc[endProp] = 'unknown'; - Disable marking maturity date as Unknown
			return;
		}
		var startDate = _parseDate(start);
		doc.start = startDate.getTime();

		// If an end date is provided, use it. Otherwise, round up the start date.
		var endDate = _parseDate((endProp && doc[endProp]) || doc[startProp], true);
		doc.end = endDate.getTime();

		doc[startProp] = _formatDate(startDate);

		// Only change the end date if it actually exists
		if ( endProp && doc[endProp] )
			doc[endProp] = _formatDate(endDate);
	}

	function _updateTable(data) {
		var myTable = $('#table-view').dataTable( {
			"data": data,
			"bSort" : false,
			"bFilter": false,
			"bDestroy": true,
			"bInfo": false,
			"bLengthChange": false,
			"bPaginate": false,
			//"iDisplayLength": 30,
			//"iDeferLoading":1,
			"scrollY": $(document).height()-140 + 'px',
			"scrollCollapse": true,
			 columns: [
			 	{ data: 'entity_name' },
				{ data: 'issue_date' },
				{ data: 'maturity_date' },
				{ data: 'issue_currency' },
				{ data: 'amount_issued' },
				{ data: 'coupon_type' },
				{ data: 'issuance_coupon' },
				{ data: 'doc_type' },
				{ data: 'pages' },
				{ data: null }
			 ],
			"columnDefs": [
				{
					"render": function ( data, type, row ) {
						return data + '<button title="Request info" class="btn btn-mini btn-info small-btn" data-id="' + row["_id"] + '"><i class="icon-info-sign icon-white"></i></button>';
					},
					"width": "20%",
					"targets": 0
				},
			{
					"render": function (data, type, row) {
						if(data) {
							if(data !== "unknown" && data !== "-") {
								return new Date(data)
											.toLocaleString("en-GB",{"day":"numeric","month":"short", "year":"numeric"})
											.replace(/\s/g,"-");
							}
							else
								return "-";
						}
						return "-";
					},
					"width": "12%",
					"targets": 1
				},
					{
					"render": function (data, type, row) {
						if(data) {
							if(data !== "unknown" && data !== "-") {
								return new Date(data)
											.toLocaleString("en-GB",{"day":"numeric","month":"short", "year":"numeric"})
											.replace(/\s/g,"-");
							}
							else
								return "-";
						}
						return "-";
					},
					"width": "12%",
					"targets": 2
				},
{
					"render": function ( data, type, row ) {
						if(!data)
							data = "-";
						return data;
					},
					"targets": [3,4,5,8]
				},
				{
					"render": function ( data, type, row ) {
						if(!data)
							data = "-";
						else {
							data = (data / 100).toFixed(3) + '%'
						}
						return data;
					},
					"targets": 6
				},
				{
					"render": function ( data, type, row ) {
						if(row['cloudpath']) {
							return '<a href="#" rel="' + row["cloudpath"] + '" class="download-btn">Download Document</a>';
						}
						return '<a href="#" rel="' + row["cloudpath"] + '" data-id="' + row["_id"] + '" class="request-btn">Request Document</a>';
					},
					"width": "10%",
					"targets": 9
				}
			]
		} );

		$(window).bind('resize', function () {
			var NewHeight = $(document).height() - 140;
			var oSettings = myTable.fnSettings();
			oSettings.oScroll.sY = NewHeight + "px";
			myTable.fnDraw();
		});

		// Keep the header horizontal scroll equal to body
		var $parent = $('#table-view').closest('.dataTables_scroll');
		var $head = $parent.find('.dataTables_scrollHead');
		var $body = $parent.find('.dataTables_scrollBody');
		$body.on('scroll', function () {
			var scrollLeft = $body.scrollLeft();
			if ( $head.scrollLeft() !== scrollLeft )
				$head.scrollLeft(scrollLeft);
		});
	}

	function _updateTimeline(hits) {
		// Used to track CATS IDs
		var catsID = 0;

		//
		// Build the timeline data array
		//
		var aDocs = [];
		$.each(hits, function (idx, doc) {
			_processStartEnd(doc, 'issue_date', 'maturity_date');

			//
			// Set the doc title
			//
			if (doc['doc_type'] !== 'Base Prospectus' && doc['doc_type'] !== 'Base Supplement') {
				doc.title = doc['issue_currency'] + ' - ' + doc['entity_name'] + ' - ' + doc['bond_type'];
				if ( doc['issuance_coupon'] ) {
					doc.title += ' - ' + (doc['issuance_coupon'] / 100).toFixed(3) + '%';
				}
				if ( doc['maturity_date'] ) {
					doc.title += ' - ' + doc['maturity_date'];
				}
			} else {
				doc.title = doc['doc_type'] + ' - ' + doc['entity_name'];
			}

			//
			// Fix the amount issued
			//
			doc['amount_issued'] = doc['amount_issued'] && _numberWithCommas(doc['amount_issued']);

			//
			// If bond has CATS, process them
			//
			if ( doc['cats'] ) {
				//
				// Process the children CATS docs
				//
				$.each(doc['cats'], function (index, cats) {
					_processStartEnd(cats, 'announce_date');

					cats._id = ++catsID;
					cats.title = cats['ca_type'];
				});

				//
				// Sort the docs by start date
				//
				doc['cats'].sort(function (a, b) {
					return a['start'] - b['start'];
				});
			}

			//
			// Store the augmented doc
			//
			aDocs.push(doc);
		});

		// Sort the docs by start date
		aDocs.sort(function (a, b) {
			return a['start'] - b['start'];
		});

		// Update the view with the docs

		// It might be the case that the timeline hasn't been initialized yet, so check for that
		var $timeline = $('#timeline');
		if ( $timeline.data('maziraTimeline') ) {
			$timeline.maziraTimeline('set', 'items', aDocs);
		} else {
			items = aDocs;
		}
	}


	// Show all faceted terms when more is clicked
	$(function () {
		$('#guidedSearch').on('click', '.more', function (e) {
			e.preventDefault();
			$(this).parent().css('display', 'none').siblings().css('display', 'inline-block');
		});
		// Add and remove tool tip to breadcrumps
		$('#breadcrumb').on('mouseover', '.brdcmb', function (e) {
			$(e.target)
				.tooltip({
					'trigger' : 'manual'
				}).tooltip('show');
		}).on('mouseleave', '.brdcmb', function() {
			$("a.brdcmb").tooltip('destroy');
		});
	});

	function _updateBreadcrumbs() {
		$(".tab-content").css("height",$(document).height() - $(".tab-content").offset().top);
		$("a.brdcmb").tooltip('destroy');
		$("#breadcrumb").html("");
		$.each(filters, function(key, val) {
			// Replace checkbox's value true into label
			if(val === 'true') {
				val = key;
			}

			var title = val.replace(/([+])/g,' ').replace(/"/g, '&quot;');
			if(val.length > 15) {
				val = val.substring(0, 12) + '...';
			}
			var breadCrumbs = $.extend({}, filters);
			delete breadCrumbs[key];
			$('<a class="btn btn-mini brdcmb" href="#' + $.param(breadCrumbs) + '" data-toggle="tooltip" title="' + title + '">' + val + ' [x]</a> ').appendTo($("#breadcrumb"));
		});
	}

	function _updateFacets(facets, numResults) {
		var $guided = $('#guidedSearch > div').empty();

		$.each(facets, function (index, facet) {
			// If there are no facet terms, it means the values might be null
			if ( !facet.terms.length ) {
				return;
			}

			// If the facet criteria has the same number of items as we are displaying, continue
			if ( facet.terms.length === 1 && facet.terms[0].count === numResults ) {
				return;
			}

			// Add the header at the top
			var $header = $('<div>' + facet.name + '</div>').appendTo($guided);

			// Maybe add a description tooltip.. try to find in power search form
			$('#' + facet.field)
				.closest('.control-group')
				.find('a.desc')
				.clone()
				.appendTo($header)
				.popover();

			var $ul = $('<ul/>').appendTo($guided);

			// Generate the option links for this facet
			$.each(facet.terms, function (index) {
				var name = this.name || this.term;

				// Temporarily change the value for this field
				var oldFilter = filters[facet.field];
				filters[facet.field] = this.term;
				var hash = $.param(filters);

				// Reset the field value
				filters[facet.field] = oldFilter;

				// If the old value is undefined, we must remove it completely
				if ( typeof oldFilter === 'undefined' ) {
					delete filters[facet.field];
				}

				var $li = $('<li><a href="#' + hash + '">' + name + '</a> (' + this.count + ')</li>').appendTo($ul);

				// By default, only display the first 6 facets
				if ( 6 <= index ) {
					$li.css('display', 'none');
				}
			});

			// Add a more... button
			if ( facet.terms.length > 6 ) {
				$('<li><a class="more" href="#">more...</a></li>').appendTo($ul);
			}
		});

		// If we didn't add any facets, show a messsage
		if ( !$guided.children().length ) {
			$guided.append($('<div>No further filtering is available.</div>'));
		}
	}

	function _updatePower() {
		// First reset the whole powersearch form
		$('#powerSearch, #textSearch').find(':input:not(:checkbox)').val('');
		$('#powerSearch, #textSearch').find(':input:checkbox').attr('checked', false);

		var sortArr = [];
		// Now set any filtered fields to the correct values
		$.each(filters, function (field, value) {

			if(field === '_sort' || field === '_sort_type') {
				sortArr.push(value);
			}

			var $control = $('#' + field);
			if ( !$control.length ) {
				console.log('Unable to find form field for ' + field);
				return;
			}

			if ( $control.is(':checkbox') ) {
				$control.attr('checked', value === 'true')
			} else if ( $control.is(':hidden') ) {
				$control.val(value);
				var parts = value.split('~');
				if ( parts.length === 2 ) {
					var reg = /(000)(?=(\d\d\d)*(?!\d))/g;
					$control.parent().find('.min:not([data-date-format])').val(parts[0].replace(reg, 'M'));
					$control.parent().find('.max:not([data-date-format])').val(parts[1].replace(reg, 'M'));

					$control.parent().find('.min[data-date-format]').val(parts[0]);
					$control.parent().find('.max[data-date-format]').val(parts[1]);
				} else {
					$control.val(value);
				}
			} else {
				$control.val(value);
			}
		});
		if(sortArr.length > 0) {
			$("#tablespace th[data-sort]").removeClass("load sorting_disabled sorting_asc sorting_desc").addClass("sorting");
			$("#tablespace th[data-sort='"+sortArr[0]+"']").addClass('sorting_'+sortArr[1]);
		}
	}

	function runQuery(query, cb) {
		// Hide the alert
		$('#alert').hide();
		_updateBreadcrumbs();

		// If there are no search filters, just get facets but don't display results
		if ( $.isEmptyObject(query) ) {
			// Clear any results
			$.getJSON('/bonds/search', {
				'_quick' : ''
			}, function (data) {
				data.facets = data.facets || [];

				$('#searchSub').text('Please refine your search');
				_updateFacets(data.facets, 0);
				_updateTimeline(data.hits);
				_updateTable(data.hits);
			});


			_updatePower();

			$('.navbar-search input').click();
			return;
		}

		// Get a stringified version of the query
		$.getJSON('/bonds/search', query, function (data) {
			// Run the callback
			cb && cb(data.error, data);

			if ( data.error ) {
				_alert('An Error Occurred', data.error, true);
				return;
			}

			data.total = data.total || 0;
			data.hits = data.hits || [];
			data.facets = data.facets || [];

			// If no results, show an alert
			if ( !data.hits.length ) {
				_alert('No Results Found', 'Please modify your search criteria and try again.');
			}

			// Update header text
			var subText = 'Showing ' + data.hits.length + ' of ';
			subText += (data.total > 1000 ? 'thousands' : data.total > 100 ? 'hundreds' : data.total);
			$('#searchSub').text(subText);

			_updateTimeline(data.hits);
			_updateTable(data.hits);
			_updateFacets(data.facets, data.total);
			_updatePower();
			_updateBreadcrumbs();
		}).error(function () {
				_alert('Unknown Error', 'There was an error processing your request. Please try again later.', true);
			}
		);
	}

	return runQuery;
}());

var hashManager = {
	_listening : false,
	_decode : function () {
		// ie7 crashes when changing, so reload instead
		if ( window._REFRESH ) {
			location.reload();
			return;
		}

		this.decode();
	},
	listen : function (listen) {
		if ( listen && !this._listening ) {
			$(window).on('hashchange', function () {
				hashManager._decode();
			});
			this._listening = true;
		} else if ( !listen && this._listening ) {
			$(window).off('hashchange');
			this._listening = false;
		}
	},
	setHash : function (hash, ignore) {
		var o1 = this;

		o1.listen(false);
		window.location.hash = hash;

		// ie7 crashes when changing, so reload instead
		if ( window._REFRESH ) {
			location.reload();
			return;
		}

		filters = $.parseParams(hash);

		// Wait for events to clear to re-enable listening
		setTimeout(function () {
			// Every time this is called, and ignore is false, we want to trigger _decode.
			// This would normally only happen if the hash changes.
			o1.listen(true);
			if ( !ignore ) {
				o1._decode();
			}
		}, 0);
	},
	decode : function () {
		var hash = window.location.hash;
		if ( hash ) {
			// Remove the actual hash character
			hash = hash.substring(1);

			filters = $.parseParams(hash);
		} else {
			filters = {};
		}

		runQuery(filters);
	}
};


function init() {
	$('#timeline').maziraTimeline({
		'level' : 20,
		'minLevel' : 13,
		'maxLevel' : 23,
		'center' : new Date().getTime(),
		'tz' : 'UTC',
		'defaultRendererKind' : $.fn.maziraTimeline.BondRendererKind,
		'needle' : true,
		'scrollZoom' : true,
		'hoverExpand' : true,
		'clickFit' : true,
		'pinButton' : true,
		'allowVertPan' : false,
		'items' : items || []
	});
	items = null;
}

var controller = {
	init : function () {
		this.initToggle();
		this.initPopovers();
		this.initAlertClose();
		this.initReset();
		this.initQuickSearch();
		this.initPowerSearch();
		this.initSearchPaneCollapse();
		this.initFeedback();
		this.initDocRequest();
		this.initDocRequestTable();
		this.initDocInfoRequest();
		this.initDocInfoRequestTable();
		//this.initLoginCheck();
		this.initCATSPopover();
		this.initCatsDocRequest();
		this.initTableSort();
		this.initTrackClick();
	},
	initToggle : function () {
		$("#toggleSwitch").on('click', function(e) {
			e.preventDefault();
			$("#timeline").toggle();
			$("#tablespace").toggle();
			if($("#timeline").css('opacity') == 0) {
				//$("#timeline").css("filter",'alpha(opacity=1)');
				$("#timeline").css("opacity",'1');

				//$("#tablespace").css("filter",'alpha(opacity=0)');
				$("#tablespace").css("opacity",'0');
			}
			else {
				//$("#timeline").css("filter",'alpha(opacity=0)');
				$("#timeline").css("opacity",'0');

				//$("#tablespace").css("filter",'alpha(opacity=1)');
				$("#tablespace").css("opacity",'1');
			}
		});
	},
	initPopovers : function () {
		$('#powerSearch a').popover();
	},
	initAlertClose : function () {
		// Hide any alerts when the x is clicked or esc is pressed
		$('#alert').on('click', '.close', function () {
			$(this).parent().hide();
		});
		$(document).keyup(function (e) {
			if ( e.keyCode === 27 ) {
				$('#alert').hide();
			}
		});
	},
	initReset : function () {
		// Listen for the reset link
		$('a.reset').on('click', function (e) {
			e.preventDefault();
			$(".recent").show();
			hashManager.setHash('');
		});
		$('#quickSearchInput').on('keydown', function() {
			if($(this).val() == ""){
				$(".recent").show();
			}
			else {
				$(".recent").hide();
			}
		});
	},
	initQuickSearch : function () {
		var $modal = $('#quickSearch');

		// Set up the navbar search to show the modal search
		$('.navbar-search input').on('click', function () {
			$modal.modal('show').find('input').val('');
			// Set focus
			setTimeout(function () {
				$modal.find('input').focus();
			}, 500);
		});

		// Initialize recent search
		$modal.find('.recent').on('click', function (e) {
			e.preventDefault();
			var date = new Date();
			hashManager.setHash('issue_date=' + date.getUTCFullYear() + '-' + (date.getUTCMonth() + 1) + '-' + date.getUTCDate() + '~');
			$modal.modal('hide');
		});

		// Indicates whether the popover is currently shown
		// (prevents an flashing effect when reshowing)
		var modaled = false;
		var poppedover = false;
		var timeout;
		var inputText = "";

		// Select the typeahead input
		var $input = $modal.find('input')
			// Initialize typeahead on the modal search bar
			.typeahead({
				'items' : 12,
				'minLength' : 2,
				'source' : function (query, process) {
					// Perform an XHR to get terms
					$.getJSON('/bonds/typeahead', {
						'query' : query
					}, function (data) {
						var items = [];

						// if the modal has since closed, return nothing
						if ( !modaled ) {
							process(items);
							return;
						}

						// Transform the array (grouped by field), to be linear
						$.each(data, function () {
							var fieldMatches = this;
							$.each(fieldMatches['values'], function () {
								items.push({
									'field' : fieldMatches['fieldName'],
									'value' : this,
									'toString' : function () {
										return this.field + ': ' + this.value;
									}
								});
							});
						});
						if(inputText == $('#quickSearchInput').val()){
							items = [];
						}
						process(items);

						if ( timeout ) {
							window.clearTimeout(timeout);
						}

						// If there are on typeahead results, and the query is multi-word, show the tooltip
						if ( !items.length && query.indexOf(' ') !== -1 && query.indexOf(':') === -1 && query.indexOf('"') === -1 ) {
							if ( !poppedover ) {
								// We want to show the popover, but delay it
								timeout = window.setTimeout(function () {
									$input.popover('show');
									poppedover = true;
								}, 1000);
							}
						} else {
							// There are typeahead results, hide popover immediately
							$input.popover('hide');
							poppedover = false;
						}
					});
				},
				'matcher' : function (item) {
					return true;
				},
				'sorter' : function (items) {
					var beginswith = []
						, caseSensitive = []
						, caseInsensitive = []
						, item
						, value;

					while ( item = items.shift() ) {
						value = item['value'];
						if ( !value.toLowerCase().indexOf(this.query.toLowerCase()) ) {
							beginswith.push(item);
						}
						else if ( ~value.indexOf(this.query) ) {
							caseSensitive.push(item);
						}
						else caseInsensitive.push(item);
					}

					return beginswith.concat(caseSensitive, caseInsensitive)
				},
				'highlighter' : function (item) {
					var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
					var value = item['value'].replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
						return '<strong>' + match + '</strong>'
					});
					return '<small><span class="label">' + item['field'] + '</span></small> ' + value;
				},
				'updater' : function (item) {
					inputText = item;
					return item;
				}
			})
			// Initialize a tooltip for phrases
			.popover({
				'placement' : 'left',
				'title' : 'Search Tip',
				'content' : 'To search for an exact phrase, surround it with quotes.',
				'trigger' : 'manual'
			});

			//Hide Tooltip on model hide
			$modal.on('shown', function() {
				modaled = true;
			});
			$modal.on('hide', function () {
				$('.typeahead .dropdown-menu').hide();
				modaled = false;
			});
			$modal.on('hidden', function () {
				$input.popover('hide');
				poppedover = false;
			});

		// Capture the search form submit and make it xhr
		$modal.find('form').on('submit', function (e) {
			e.preventDefault();

			var query = $(this).find('input').val();

			// Check if we have field : value, which is really simple to search for!
			var parts = query.split(':');
			if ( parts.length >= 2 ) {
				var field = $.trim(parts[0]).toLowerCase().replace(/ /g, '_');

				// Ensure the field is a valid power-search field
				if ( $('#powerSearch #' + field).length ) {
					var value = $.trim(parts[1]);
					hashManager.setHash(field + '=' + value);
					$modal.modal('hide');
					return;
				}
			}

			// Not a field : value query... to regular quick search
			runQuery({ '_quick': query }, function (err, data) {
				$modal.modal('hide');

				if ( err ) return;

				if ( data.type ) {
					if ( data.type === 'id' ) {
						filters['id'] = query;
						hashManager.setHash('id=' + query, true);
					} else if ( data.type === 'text' ) {
						filters['text'] = query;
						hashManager.setHash('text=' + query, true);
					}
				} else {
					// Empty string search
					delete filters['text'];
					hashManager.setHash('', true);
				}
			});
		});
	},
	initPowerSearch : function () {
		var $powerForm = $('#btnPowerSearch').closest('form');

		// Initialize date range fields
		$powerForm.find('.date-range input:text').each(function () {
			$(this).datepicker();
		});

		// Initialize typeahead text fields
		$powerForm.find('input.text').typeahead({
			'minLength' : 2,
			'source' : function (query, process) {
				// Perform an XHR to get terms
				$.getJSON('/bonds/typeahead', {
					'field' : this.$element.attr('name'),
					'query' : query
				}, process);
			},
			'matcher' : function (item) {
				return true;
			}
		});

		// Handle actual power search action
		$('#btnPowerSearch, #btnTextSearch').click(function (e) {
			var $textForm = $('#btnTextSearch').closest('form');
			var $inputs = $();

			// First, go through and set the hidden slider form elements
			$powerForm.find('.sliderbar').each(function () {
				var $slider = $(this);
				var min = +$slider.attr('min');
				var max = +$slider.attr('max');

				var values = $slider.noUiSlider('getValue');
				var low = Math.round(values[0]);
				var high = Math.round(values[1]);

				var changed = (low !== min || high !== max);
				var val = changed ? low + ':' + high : '';

				$slider.siblings('input.value').val(val);
			});

			// Now go through and set all number range fields
			$powerForm.find('.number-range').each(function () {
				var reg = /m/gi;
				var min = parseInt($(this).find('.min').val().replace(reg, '000'), 10);
				var max = parseInt($(this).find('.max').val().replace(reg, '000'), 10);
				var val = '';

				if ( !isNaN(min) || !isNaN(max) ) {
					min = isNaN(min) ? '' : min;
					max = isNaN(max) ? '' : max;
					val = min + '~' + max;
				}

				$(this).find('input:hidden').val(val);
			});

			// Now go through and set the date range fields
			$powerForm.find('.date-range').each(function () {
				var min = $(this).find('.min').val();
				var max = $(this).find('.max').val();
				var val = '';

				if ( min || max ) {
					val = min + '~' + max;
				}

				$(this).find('input:hidden').val(val);
			});

			// Get all form inputs that are not unchecked checkboxes
			$inputs = $inputs.add($powerForm.find(':input')).add($textForm.find(':input'));

			var data = $inputs
				.filter(function () {
					var $this = $(this);

					// Remove inputs without a name
					if ( !$this.attr('name') ) {
						return false;
					}

					// Exclude unchecked bools
					if ( $this.is(':checkbox') ) {
						return $this.attr('checked');
					}
					return $(this).val() !== '';
				});

			var hash = $.param(data);

			// Set the hash.. this will trigger query
			hashManager.setHash(hash);

			e.preventDefault();
		});
	},
	initSearchPaneCollapse : function () {
		// Collapse search pane
		var expanded = true;
		$('#search .icon-collapse').on('click', function (e) {
			var $icon = $(this);
			expanded = !expanded;
			if ( !expanded ) {
				$('#search').animate({
					'left' : -280
				}, 500, function () {
					$('#search .title').addClass('box-rotate').siblings().not('.icon-collapse').hide();
					$icon.removeClass('icon-chevron-left').addClass('icon-chevron-right');
				});
				$('#timeline').animate({
					'left' : 25
				}, {
					'step' : function () {
						$(window).resize();
					}
				});
				$('#tablespace').animate({
					'left' : 35
				},
				 {
					'step' : function () {
						$(window).resize();
					}
				});
			} else {
				$('#search .title').removeClass('box-rotate').siblings().not('icon-collapse').show();
				$icon.removeClass('icon-chevron-right').addClass('icon-chevron-left');

				$('#search').animate({
					'left' : 0
				}, 500);
				$('#timeline').animate({
					'left' : 305
				}, {
					'step' : function () {
						$(window).resize();
					}
				});
				$('#tablespace').animate({
					'left' : 315
				}, {
					'step' : function () {
						$(window).resize();
					}
				});
			}
		});
	},
	initFeedback : function () {
		$('button.feedback').on('click', function () {
			// Get the feedback modal
			var $modal = $('#feedback').modal('show');

			// Get the feedback submit button
			var $button = $modal.find('button.btn-primary');

			*//**
			 * Executed when the feedback submit button is clicked
			 *//*
			var onSubmitClick = function () {
				var subject = $modal.find('input.subject').val();
				var msg = $modal.find('textarea').val();
				var onAjaxSuccess = function () {
					// Set button text
					$button.button('complete');

					// Close the modal after 1 second
					setTimeout(function () {
						$modal.modal('hide');
					}, 1000);
				};

				// Set button texta and disable
				$button.button('loading').attr('disabled', 'disabled');

				// Send the data
				$.ajax({
					'url' : '/feedback',
					'type' : 'POST',
					'data' : {
						'subject' : subject,
						'msg' : msg
					},
					'success' : onAjaxSuccess
				})
			};

			//
			// Reset the feedback form
			//
			$modal.find('textarea').val('');
			$modal.find('input.subject').val('');

			// Fcous on the subject box - delayed to make sure it's visible
			setTimeout(function () {
				$modal.find('input.subject').focus();
			}, 500);

			//
			// Setup the submit button to submit the proper feedback message
			//
			$button
				.button('reset')
				.off('click.submit')
				.one('click.submit', onSubmitClick);
		});
	},
	initDocRequest : function () {
		// Handle doc request
		$('#timeline').on('click', 'button.doc-request', function (e) {
			var idBond = $(e.target).closest('.cell').find('.header').attr('rel');
			var $modal = $('#docRequest').modal('show');
			setTimeout(function () {
				$modal.find('button').focus();
			}, 500);
			var $button = $modal.find('button.btn-primary')
				.button('reset')
				.off('click.reset')
				.one('click.reset', function () {
					$button.button('loading').attr('disabled', 'disabled');
					$.ajax({
						'url' : '/bonds/request/' + idBond,
						'type' : 'POST',
						'success' : function () {
							$button.button('complete');
							setTimeout(function () {
								$modal.modal('hide');
							}, 1000);
						}
					})
				});
		});
	},
	initDocRequestTable : function () {
		// Handle doc request
		$('#tablespace').on('click', '.request-btn', function (e) {
			e.preventDefault();
			var idBond = $(this).attr('data-id');
			var $modal = $('#docRequest').modal('show');
			setTimeout(function () {
				$modal.find('button').focus();
			}, 500);
			var $button = $modal.find('button.btn-primary')
				.button('reset')
				.off('click.reset')
				.one('click.reset', function () {
					$button.button('loading').attr('disabled', 'disabled');
					$.ajax({
						'url' : '/bonds/request/' + idBond,
						'type' : 'POST',
						'success' : function () {
							$button.button('complete');
							setTimeout(function () {
								$modal.modal('hide');
							}, 1000);
						}
					})
				});
		});
	},
	initDocInfoRequestTable : function () {
		$("#tablespace").on('click', ".small-btn" , function (e) {
			var idBond = $(this).attr('data-id');
			var $modal = $('#infoRequest').modal('show');
			setTimeout(function () {
				$modal.find('textarea').focus();
			}, 500);
			$modal.find('textarea').val('');
			var $button = $modal.find('button.btn-primary')
				.button('reset')
				.off('click.reset')
				.one('click.reset', function () {
					$button.button('loading').attr('disabled', 'disabled');
					$.ajax({
						'url' : '/bonds/request/' + idBond,
						'type' : 'POST',
						'data' : {
							'msg' : $modal.find('textarea').val()
						},
						'success' : function () {
							$button.button('complete');
							setTimeout(function () {
								$modal.modal('hide');
							}, 1000);
						}
					})
				});
		});
	},
	initDocInfoRequest : function () {
		var infoHtml = '<button title="Request info" class="btn btn-mini btn-info"><i class="icon-info-sign icon-white"></i></button>';
		var $info = $(infoHtml).on('click', function (e) {
			var idBond = $(e.target).closest('.cell').find('.header').attr('rel');
			var $modal = $('#infoRequest').modal('show');
			setTimeout(function () {
				$modal.find('textarea').focus();
			}, 500);
			$modal.find('textarea').val('');
			var $button = $modal.find('button.btn-primary')
				.button('reset')
				.off('click.reset')
				.one('click.reset', function () {
					$button.button('loading').attr('disabled', 'disabled');
					$.ajax({
						'url' : '/bonds/request/' + idBond,
						'type' : 'POST',
						'data' : {
							'msg' : $modal.find('textarea').val()
						},
						'success' : function () {
							$button.button('complete');
							setTimeout(function () {
								$modal.modal('hide');
							}, 1000);
						}
					})
				});
		});

		// Add the info button to any hovered cells
		$('#timeline')
			.on('mouseenter', '.cell', function (e) {
				// Only add the info button to root cells, i.e. base bonds
				var cell = $('#timeline').maziraTimeline('cellFromElement', e.target);
				if ( typeof cell._idParent === 'undefined' )
					$(this).find('.header').append($info);
			})
			.on('mouseleave', '.cell', function () {
				$info.detach();
			});
	},
	initCatsDocRequest : function () {
		// Handle doc request
		$('#timeline').on('click', 'a[rel]', function (e) {
			e.preventDefault();
			var idBond = $(e.target).attr('rel');
			var $modal = $('#docRequest').modal('show');
			setTimeout(function () {
				$modal.find('button').focus();
			}, 500);
			var $button = $modal.find('button.btn-primary')
				.button('reset')
				.off('click.reset')
				.one('click.reset', function () {
					$button.button('loading').attr('disabled', 'disabled');
					$.ajax({
						'url' : '/bonds/request/' + idBond,
						'type' : 'POST',
						'success' : function () {
							$button.button('complete');
							setTimeout(function () {
								$modal.modal('hide');
							}, 1000);
						}
					})
				});
		});
	},
	initLoginCheck : function () {
		function checkLoginOrRedirect() {
			$.getJSON('/api/checklogin', function (data) {
				if ( data.logged_in )
					window.setTimeout(checkLoginOrRedirect, 5000);
				else
					window.location.href = "/"
			});
		}

		window.setTimeout(checkLoginOrRedirect, 5000);
	},
	initCATSPopover : function () {
		*//**
		 * Manually destroys all of the CASTS tooltips because their
		 * triggers may have been removed from the DOM.
		 *//*
		var destroyAll = function () {
			var $children = $('body').children('div.tooltip');
			$children.remove();
		};

		//
		// Set up events to create the tooltips on mouseover.
		// This is so we don't have to create tooltips for every CATS dot.
		//
		$('#timeline')
			.on('mouseenter', 'a.cats', function (e) {
				destroyAll();
				$(e.target)
					.tooltip({
						'trigger' : 'manual'
					})
					.tooltip('show');
			})
			.on('mouseleave', 'a.cats', function (e) {
				destroyAll();
			});
	},
	initTableSort : function () {
		$('#table-view th').on('click',function (e) {
			var field = $(this).attr('data-sort');
			var sortType = $(this).attr('data-sort-type') || 'desc';
			if ( sortType === 'desc' )
				$(this).attr('data-sort-type','asc');
			else
				$(this).attr('data-sort-type','desc');

			if ( field ) {
				$(this).removeClass("sorting_disabled sorting_asc sorting_desc sorting").addClass("load");
				var filters = {};
				var query = document.location.hash.replace("#","").split("&");
				$.each(query,function(index,value) {
					if(value) {
						var args = value.split("=");
						filters[args[0]] = args[1];
					}
				});
				filters['_sort'] = field;
				filters['_sort_type'] = sortType;
				var hash = decodeURIComponent($.param(filters));
				hashManager.setHash(hash);
			}
		});
	},
	initTrackClick : function () {
		var stripe_public_key = '';

		var showError = function () {
			document.write('A critical error occurred.  Our support staff will work to fix the problem.<br><br>');
			var backButton = '<button onclick="window.location.reload();">Back to BondPDF</button>';
			document.write(backButton);
		};

		var sendPurchase = function (postUrl, postData, cb) {
			postData.costCode = postData.costCode || null;

			$.ajax({
				url : postUrl,
				type : 'POST',
				data : postData,
				success : function () {
					cb();
				},
				error : function (err) {
					cb(err || true);
				}
			});
		};

		*//**
		 * Store the download in the database and open the document
		 * Needs to be called in click handler
		 *//*
		var open = function (postUrl, postData) {
			var bondWindow = window.open();

			sendPurchase(postUrl, postData, function (err) {
				if (err) {
					bondWindow.close();
					showError();
					return;
				}

				bondWindow.location.replace('/bonds/' + postData.cloudpath + '.pdf');
			});
		};

		var getCostCode = function (cb) {
			var $costCodeModal = $('#ccodeRequest').modal('show');
			$costCodeModal.off('click');

			$costCodeModal.on('click', '.btn.btn-primary', function (event) {
				event.preventDefault();

				var costCode = $costCodeModal.find('textarea').val();
				cb(costCode || null);
			});
		};

		*//**
		 * This method asks for a cost code, sends a purchase request, and then trys to open the purchased document.
		 * Does not need to be called in 'click' event handler
		 *//*
		var getCostCodeAndOpen = function (postUrl, postData) {
			getCostCode(function (costCode) {
				postData.costCode = code;
				open(postUrl, postData);
			});
		};

		var confirmFreePurchase = function (downloadsFree, downloadsUsed, costCode, cloudpath, cb) {
			// the user has free downloads remaining, so ask them if they want to use a free download to download the document

			var freeDownloadConfirmHtml = '<div id="freeDownloadConfirm" class="modal hide">'
										+ '<div class="modal-header">'
										+ '<button type="button" class="close" data-dismiss="modal" '
										+ 'onclick="$(\'#freeDownloadConfirm\').modal(\'hide\');">ï¿½</button>'
										+ '<h3>Free Download</h3></div>'
										+ '<div class="modal-body">'
										+ '<p>You have ' + (downloadsFree - downloadsUsed)
										+ ' of ' + downloadsFree + ' free downloads remaining.  '
										+ 'Would you like to use a free download to download this document?</p>'
										+ '</div>'
										+ '<div class="modal-footer">'
										+ '<button type="button" class="btn" data-dismiss="modal" '
										+ 'onclick="$(\'#freeDownloadConfirm\').modal(\'hide\');">Cancel</button>'
										+ '<button id="confirmFreeDownload" type="button" class="btn btn-primary">Download</button>'
										+ '</div></div>';

			$('#freeDownloadConfirm').remove();
			var $modal = $('<div/>').html(freeDownloadConfirmHtml).contents();
			$(document.body).append($modal);
			$modal.modal('show');

			$('#confirmFreeDownload').on('click', function () {
				$('#freeDownloadConfirm').modal('hide');

				var data = {
					cloudpath : cloudpath,
					doc_id : cloudpath.substring(cloudpath.indexOf('/') + 1)
				};

				if ( costCode ) {
					getCostCodeAndOpen('/freedownload', data);
				} else {
					open('/freedownload', data);
				}

				// trigger callback to update download display
				cb();
			});
		};

		var handlePurchase = function (costCode, cloudpath, cb) {
			var handler = StripeCheckout.configure({
				key : stripe_public_key,
				token : function (token, args) {
					var _confirmModal = function () {
						var purchaseSuccessfulHtml =  '<div id="purchaseSuccessful" class="modal hide">'
													+ '<div class="modal-header">'
													+ '<button type="button" class="close" data-dismiss="modal" '
													+ 'onclick="$(\'#purchaseSuccessful\').modal(\'hide\');">ï¿½</button>'
													+ '<h3>Payment Successful</h3></div>'
													+ '<div class="modal-body">'
													+ '<p>Document purchase succeeded.  Click the button below to view the document.</p></div>'
													+ '<div class="modal-footer">'
													+ '<button type="button" class="btn" data-dismiss="modal" '
													+ 'onclick="$(\'#purchaseSuccessful\').modal(\'hide\');">Close</button>'
													+ '<a class="btn btn-primary" href="/bonds/' + cloudpath + '.pdf" target="_blank"'
													+ 'onclick="$(\'#purchaseSuccessful\').modal(\'hide\');">View Document</a></div></div>';

						$('#purchaseSuccessful').remove();
						var $modal = $('<div/>').html(purchaseSuccessfulHtml).contents();
						$(document.body).append($modal);
						$modal.modal('show');
					};

					var _sendPurchase = function (data) {
						sendPurchase('/buypdf', data, function (err) {
							if (err) {
								showError();
								return;
							}

							_confirmModal();
							// trigger callback to update download display
							cb();
						});
					};

					var data = {
						cloudpath : cloudpath,
						doc_id : cloudpath.substring(cloudpath.indexOf('/') + 1),
						token : token,
						costCode : costCode
					};

					if ( costCode ) {
						getCostCode(function (costCode) {
							data.costCode = costCode;
							_sendPurchase(data);
						});
					} else {
						_sendPurchase(data);
					}
				}
			});

			// Open Stripe checkout
			handler.open({
				name : 'BondPDF',
				description : '1 PDF (ï¿½' + (stripeChargeAmount / 100).toFixed(2) + ')',
				amount : stripeChargeAmount,
				currency : 'gbp'
			});
		};

		// add button click handlers
		$("#table-view").on('click', '.freeDownloadUnlimitedCostCode', function (e) {
			e.preventDefault();
			var cloudpath = $(this).closest('a').attr('rel');
			getCostCodeAndOpen('/freedownload', {
				cloudpath : cloudpath,
				doc_id : cloudpath.substring(cloudpath.indexOf('/') + 1)
			});
		});

		$("#table-view").on('click', '.freeDownloadUnlimited', function (e) {
			e.preventDefault();
			var cloudpath = $(this).closest('a').attr('rel');
			open('/freedownload', {
				cloudpath : cloudpath,
				doc_id : cloudpath.substring(cloudpath.indexOf('/') + 1),
				costCode : null
			});
		});


		// used to prevent multiple clicks quickly
		var disabled = false;
		$("#table-view").on('click', '.download-btn', function(e){
			// always prevent default
			e.preventDefault();

			if (disabled)
				return;

			// used to prevent multiple clicks quickly
			disabled = true;

			$(this).html('<img src="/img/load.gif">')
			var cloudpath = $(this).attr('rel');
			var doc_id_value = cloudpath.substring(cloudpath.indexOf('/') + 1);
			var _self = this;

			var cb = function(data) {
				$(_self).html(data);
				//console.log(data);
				$(_self).removeClass("download-btn");
			}

			var makeIcon = function () {
				cb($('<a href="/bonds/' + cloudpath + '.pdf" title="Open PDF" target="_blank"><img src="/img/pdficon_large.png"/></a>'));
			};

			$.ajax({
				url : '/candownload',
				type : 'POST',
				data : { 'doc_id' : doc_id_value },
				dataType : 'json',

				success : function (result) {
					// reset the button from spinning to text.. after a short delay (enough time for stripe modal to appear)
					setTimeout(function () {
						disabled = false;
					}, 500);
					$(_self).html('Download Document')

					stripe_public_key = result.stripe_public_key;
					var costCode = result.costCode;
					console.log('Cost code required: ' + costCode);

					if ( result.purchased ) {
						return makeIcon();

					} else if ( result.downloadLimit < 0 ) {
						// the user has unlimited free downloads

						if ( costCode )
							return cb($('<input class="freeDownloadUnlimitedCostCode" type="image" src="/img/pdficon_large.png" title="Open PDF"></input>'));
						else
							return cb($('<input class="freeDownloadUnlimited" type="image" src="/img/pdficon_large.png" title="Open PDF"></input>'));

					} else if ( result.freeDownloadsUsed < result.downloadLimit ) {
						confirmFreePurchase(result.downloadLimit, result.freeDownloadsUsed, costCode, cloudpath, makeIcon);
					} else {
						handlePurchase(costCode, cloudpath, makeIcon);
					}
				},

				error : function (jqXHR, textStatus, errorThrown) {
					console.log('Error checking whether user can download document: ' + textStatus + ': ' + errorThrown + ': ' + jqXHR.responseText);
					document.write(jqXHR.responseText + '<br><br>');
					var backButton = '<button onclick="window.location.reload();">Back to BondPDF</button>';
					document.write(backButton);
					//return cb($(jqXHR.responseText));
				}
			});
		});
	}
};

$(function () {
	controller.init();
});

$(function () {
	// Execute on load!

	// Listen to hash-change events, and trigger initial
	hashManager.listen(true);
	hashManager.decode();


	// Load the timeline renderers
	init();
});*/