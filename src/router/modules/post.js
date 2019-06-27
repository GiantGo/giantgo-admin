/** When your routing table is too long, you can split it into small modules**/

const DefaultLayout = () => import('../../layouts/Default/Index.vue')
const PostList = () => import(/* webpackChunkName: "post" */ '../../views/Post/List.vue')

const systemRouter = [
  {
    path: '/post',
    component: DefaultLayout,
    children: [
      {
        path: 'list',
        component: PostList
      }
    ]
  }
]

export default systemRouter
