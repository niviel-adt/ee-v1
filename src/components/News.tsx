import {ArrowUpRight} from 'lucide-react';
import {news} from '../data/news';
import {Label} from './Sections';

const formatDate=(date:string)=>new Intl.DateTimeFormat('en',{month:'long',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(`${date}T00:00:00Z`));

export function News(){
 const posts=[...news].sort((a,b)=>b.date.localeCompare(a.date));
 if(!posts.length)return null;
 return <section id="news" className="section news" aria-labelledby="news-title">
  <Label number="05">FROM THE COLLECTIVE</Label>
  <div className="section-heading"><h2 id="news-title">THE LATEST<br/>FROM THE ERA.</h2><p>Announcements and stories.<br/>Straight from Exalted Era.</p></div>
  <div className="news-list">{posts.map(post=><article className="news-card" id={post.id} key={post.id} aria-labelledby={`${post.id}-title`}>
   <div className="news-meta"><span>{post.category}</span><time dateTime={post.date}>{formatDate(post.date)}</time></div>
   <div className="news-body"><h3 id={`${post.id}-title`}>{post.title}</h3><p className="news-summary">{post.summary}</p>
    <details className="news-details"><summary>Read announcement<span className="sr-only">: {post.title}</span></summary><div>{post.paragraphs.map(paragraph=><p key={paragraph}>{paragraph}</p>)}</div></details>
    <div className="news-actions"><a className="text-link" href={post.link.href}>{post.link.label} <ArrowUpRight size={16} aria-hidden="true"/></a><a className="news-permalink" href={`#${post.id}`} aria-label={`Permanent link to ${post.title}`}>POST LINK ↗</a></div>
   </div>
  </article>)}</div>
 </section>;
}
