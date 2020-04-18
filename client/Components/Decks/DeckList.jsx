import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import { withTranslation, Trans } from 'react-i18next';

import DeckRow from './DeckRow';
import RadioGroup from '../Form/RadioGroup';

class DeckList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchFilter: '',
            expansionFilter: '',
            sortOrder: 'datedesc',
            pageSize: 20,
            currentPage: 0,
            starredDecks: {},
        };

        try {
            const starredDecks = localStorage.getItem('starredDecks');
            if (starredDecks) {
                this.state.starredDecks = JSON.parse(starredDecks);
            }
        } catch (e) {
            console.log(e);
        }

        this.changeFilter = _.debounce(filter => this.onChangeFilter(filter), 200);
        this.onChangeExpansionFilter = this.onChangeExpansionFilter.bind(this);
        this.filterDeck = this.filterDeck.bind(this);
        this.onSortChanged = this.onSortChanged.bind(this);
        this.onPageSizeChanged = this.onPageSizeChanged.bind(this);
        this.onToggleStar = this.onToggleStar.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    filterDeck(deck) {
        const passedSearchFilter = this.state.searchFilter === '' || deck.name.toLowerCase().includes(this.state.searchFilter);
        const passedExpansionFilter = this.state.expansionFilter === '' || (
            (this.state.expansionFilter === 'World\'s Collide' && deck.expansion === 452) ||
            (this.state.expansionFilter === 'Age of Ascension' && deck.expansion === 435) ||
            (this.state.expansionFilter === 'Call of the Archons' && deck.expansion === 341)
        );

        return passedSearchFilter && passedExpansionFilter;
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    onChangeFilter(filter) {
        this.setState({
            currentPage: 0,
            searchFilter: filter.toLowerCase()
        });
    }

    onChangeExpansionFilter(event) {
        this.setState({
            currentPage: 0,
            expansionFilter: event.target.value
        });
    }

    onSortChanged(event) {
        this.setState({ sortOrder: event.target.value });
    }

    onPageSizeChanged(event) {
        this.setState({
            currentPage: 0,
            pageSize: parseInt(event.target.value, 10)
        });
    }

    onPageChanged(page) {
        this.setState({ currentPage: page });
    }

    onToggleStar(uuid) {
        if (this.props.disableStarring) {
            return;
        }

        const deckState = {};
        if (this.state.starredDecks[uuid]) {
            deckState[uuid] = !this.state.starredDecks[uuid];
        } else {
            deckState[uuid] = true;
        }

        const starredDecks = Object.assign(this.state.starredDecks, deckState)
        this.setState({
            starredDecks,
        })

        try {
            localStorage.setItem('starredDecks', JSON.stringify(starredDecks));
        } catch (e) {
            console.log(e);
        }

    }

    render() {
        let { activeDeck, className, decks, onSelectDeck, t } = this.props;

        let deckRows = [];
        let numDecksNotFiltered = 0;

        if(!decks || decks.length === 0) {
            deckRows = 'Loading... if no decks appear after a few seconds, try refreshing the page.';
        } else {
            let index = 0;
            let sortedDecks = decks;

            switch(this.state.sortOrder) {
                case 'dateasc':
                    sortedDecks = _.sortBy(sortedDecks, 'lastUpdated');
                    break;
                case 'nameasc':
                    sortedDecks = _.sortBy(sortedDecks, 'name');
                    break;
                case 'namedesc':
                    sortedDecks = _.sortBy(sortedDecks, 'name').reverse();
                    break;
                case 'datedesc':
                default:
                    break;
            }

            sortedDecks = _.sortBy(sortedDecks, (deck) => this.state.starredDecks[deck.uuid] ? -1 : 1);
            sortedDecks = sortedDecks.filter(this.filterDeck);
            numDecksNotFiltered = sortedDecks.length;

            if (!this.props.showAll) {
                sortedDecks = sortedDecks.slice(this.state.currentPage * this.state.pageSize, (this.state.currentPage * this.state.pageSize) + this.state.pageSize);
            }

            for(let deck of sortedDecks) {
                deckRows.push(
                    <DeckRow 
                        active={ activeDeck && activeDeck._id === deck._id }
                        deck={ deck }
                        key={ index++ }
                        onSelect={ onSelectDeck }
                        starred={ !!this.state.starredDecks[deck.uuid] }
                        onToggleStar={ this.onToggleStar }
                        hideHouses={ this.props.hideHouses }
                        hideSet={ this.props.hideSet }
                        hideChains={ this.props.hideChains }
                    />
                );
            }
        }

        let pager = [];
        let pages = _.range(0, Math.ceil(numDecksNotFiltered / this.state.pageSize));
        for(let page of pages) {
            pager.push(<li key={ page }><a href='#' className={ (page === this.state.currentPage ? 'active' : null) } onClick={ this.onPageChanged.bind(this, page) }>{ page + 1 }</a></li>);
        }

        return (
            <div className={ className }>
                { !this.props.hideControls && <form className='form' onSubmit={ this.handleSubmit }>
                    <div className='col-md-8'>
                        <div className='form-group'>
                            <input className='form-control' placeholder='Search by deck name' type='text' onChange={ e => this.changeFilter(e.target.value) }/>
                        </div>
                    </div>
                    <div className='col-md-4' style={{ display: 'none' }}>
                        <div className='form-group'>
                            <select className='form-control' onChange={ this.onPageSizeChanged }>
                                <option value='10'>10 decks</option>
                                <option value='25'>25 decks</option>
                                <option value='50'>50 decks</option>
                            </select>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className='form-group'>
                            <select className='form-control' onChange={ this.onSortChanged }>
                                <option value='' hidden disabled>Sort By</option>
                                <option value='datedesc'>Date Desc</option>
                                <option value='dateasc'>Date Asc</option>
                                <option value='nameasc'>Name Asc</option>
                                <option value='namedesc'>Name Desc</option>
                            </select>
                        </div>
                    </div>
                    <div className='col-md-12'>
                        <div className='form-group'>
                            <select className='form-control' onChange={ this.onChangeExpansionFilter }>
                                <option value=''>All Expansions</option>
                                <option>World&#39;s Collide</option>
                                <option>Age of Ascension</option>
                                <option>Call of the Archons</option>
                            </select>
                        </div>
                    </div>
                    <nav className='col-md-12' aria-label={ t('Page navigation') } >
                        <ul className='pagination' style={{ margin: '0 0 10px 0' }}>
                            <li>
                                <a href='#' aria-label={ t('Previous') } onClick={ this.onPageChanged.bind(this, 0) }>
                                    <span aria-hidden='true'>&laquo;</span>
                                </a>
                            </li>
                            { pager }
                            <li>
                                <a href='#' aria-label={ t('Next') } onClick={ this.onPageChanged.bind(this, pages.length - 1) }>
                                    <span aria-hidden='true'>&raquo;</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </form> }
                <div className='col-md-12'>{ deckRows }</div>
            </div>);
    }
}

DeckList.propTypes = {
    activeDeck: PropTypes.object,
    className: PropTypes.string,
    decks: PropTypes.array,
    i18n: PropTypes.object,
    onSelectDeck: PropTypes.func,
    t: PropTypes.func
};

export default withTranslation()(DeckList);
