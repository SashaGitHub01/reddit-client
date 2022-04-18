import type { NextPage } from 'next'
import HomeOptions from '../components/Home/HomeOptions'
import PostsList from '../components/Home/PostsList'
import Wrapper from '../components/Wrapper'
import { useMeQuery } from '../generated/graphql'
import { withApollo } from '../utils/withApollo'

const Home: NextPage = () => {
   const { data } = useMeQuery()

   return (
      <Wrapper>
         <div className="">
            {data?.me
               ? <HomeOptions />
               : null}
            <PostsList />
         </div>
      </Wrapper>
   )
}

export default withApollo({ ssr: true })(Home)
