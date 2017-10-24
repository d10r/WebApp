import feathers from '~/plugins/feathers'
import _ from 'lodash'

const commentsService = feathers.service('comments')

export const state = () => {
  return {
    comments: [],
    loading: true
  }
}

export const mutations = {
  loading (state, status) {
    state.loading = status
  },
  set (state, comments) {
    state.comments = _.castArray(comments)
  },
  clear (state) {
    state.comments = []
  }
}

export const getters = {
  all (state) {
    return state.comments
  },
  isLoading (state) {
    return state.loading
  },
  count (state) {
    return state.comments.length
  }
}

export const actions = {
  // Called from plugins/init-store-subscriptions only once
  subscribe ({dispatch}) {
    return commentsService
      .on('created', _.debounce((comment) => {
        dispatch('fetchByContributionId', comment.contributionId)
      }, 500))
      .on('patched', _.debounce((comment) => {
        dispatch('fetchByContributionId', comment.contributionId)
      }, 500))
  },
  fetchByContributionId ({commit}, contributionId) {
    return commentsService.find({
      query: {
        contributionId: contributionId,
        $sort: {
          upvoteCount: -1,
          createdAt: 1
        },
        $limit: 50
      }
    })
      .then((result) => {
        commit('set', result.data)
        commit('loading', false)
      })
      .catch((e) => {
        commit('loading', false)
      })
  },
  fetchById ({commit}, id) {
    return commentsService.get(id)
  },
  upvote ({dispatch}, comment) {
    console.log(comment)
    return commentsService.patch(comment._id, {
      $inc: {
        upvoteCount: 1
      }
    }).then((res) => {
      dispatch('fetchByContributionId', comment.contributionId)
    })
  },
  async create ({dispatch}, data) {
    return commentsService.create(data)
  }
}
