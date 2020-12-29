import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  cafesChannelID = 'UC3gM1MgRK_1WCSA9JzHP91A';
  techNewsPlaylistID = 'PLYGZhuW25o1mN9Hw-wP2Y-NFDqd-ZxHk7';
  gamingNewsPlaylistID = 'PLYGZhuW25o1k2TvV7Bk7i9a7LvFsPlaee';
  setupWarsPlaylistID = 'PLYGZhuW25o1nfcKyfREpDanku67-ZL0q8';
  reviewsPlaylistID = 'PLYGZhuW25o1mhdRy_V3CpLzXp6PMmjZvI';
  gameplaysPlaylistID = 'PLYGZhuW25o1n6_ekaacdiQ-XnjsZSjmtv';
  name = 'Set iframe source';
  url = 'https://www.twitch.tv/embed/20cafespordia/chat?parent=20cafes.com';
  urlSafe: SafeResourceUrl;
  latestVideoLinkFromPlaylist: SafeResourceUrl;
  latestVideoLinkFromChannel: SafeResourceUrl;
  latestTechNewsVideoThumbnail: string;
  latestGamingNewsVideoThumbnail: string;
  latestSetupWarsVideoThumbnail: string;
  latestReviewsVideoThumbnail: string;
  latestGameplaysVideoThumbnail: string;
  videoRawUrl: string;

  constructor(public sanitizer: DomSanitizer, private http: HttpClient) { }

  ngOnInit() {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url); 
    this.getLatestVideo('channel', this.cafesChannelID);
    this.getLatestVideo('playlist', this.techNewsPlaylistID, 'techNews');
    this.getLatestVideo('playlist', this.gamingNewsPlaylistID, 'gamingNews');
    this.getLatestVideo('playlist', this.setupWarsPlaylistID, 'setupWars');
    this.getLatestVideo('playlist', this.gameplaysPlaylistID, 'gameplays');
  }

  getLatestVideo(playlistOrChannel: string, Id: string, playlistName?: string) {
    if (playlistOrChannel === 'playlist') {

      if (playlistName) {
        if (playlistName === 'gamingNews') {
          this.getLatestVideoFromPlaylist(Id).then((data) => {
            this.latestVideoLinkFromPlaylist = this.sanitizer.bypassSecurityTrustResourceUrl(data);
            this.latestGamingNewsVideoThumbnail = this.getVideoThumbnail(data);
          });
        } else if (playlistName === 'techNews') {
          this.getLatestVideoFromPlaylist(Id).then((data) => {
            this.latestVideoLinkFromPlaylist = this.sanitizer.bypassSecurityTrustResourceUrl(data);
            this.latestTechNewsVideoThumbnail = this.getVideoThumbnail(data);
          });
        } else if (playlistName === 'setupWars') {
          this.getLatestVideoFromPlaylist(Id).then((data) => {
            this.latestVideoLinkFromPlaylist = this.sanitizer.bypassSecurityTrustResourceUrl(data);
            this.latestSetupWarsVideoThumbnail = this.getVideoThumbnail(data);
          });
        }
        else if (playlistName === 'gameplays') {
          this.getLatestVideoFromPlaylist(Id).then((data) => {
            this.latestVideoLinkFromPlaylist = this.sanitizer.bypassSecurityTrustResourceUrl(data);
            this.latestGameplaysVideoThumbnail = this.getVideoThumbnail(data);
          });
        }
      } else {
        this.getLatestVideoFromPlaylist(Id).then((data) => {
          this.latestVideoLinkFromPlaylist = this.sanitizer.bypassSecurityTrustResourceUrl(data);
          this.videoRawUrl = this.getVideoThumbnail(data);
        });
      }
    }
    if (playlistOrChannel === 'channel') {
      this.getLatestVideoFromChannel(Id).then((data) => {
        this.latestVideoLinkFromChannel = this.sanitizer.bypassSecurityTrustResourceUrl(data);
        this.videoRawUrl = this.getVideoThumbnail(data);
      });
    }
  }

  getVideoThumbnail(videoLink: string) {
    const videoId = videoLink.substr(videoLink.indexOf('embed/') + 6);
    const videoThumbnailUrl = 'https://img.youtube.com/vi/' + videoId + '/maxresdefault.jpg';
    return videoThumbnailUrl;
  }

  getLatestVideoFromChannel(channelID): Promise<any> {
    let finalLink = new Promise((resolve, reject) => {
      this.http.get('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.youtube.com%2Ffeeds%2Fvideos.xml%3Fchannel_id%3D' + channelID)
        .subscribe(
        (data) => {
          const link = data['items'][0].link;
          const id = link.substr(link.indexOf('=') + 1);
          resolve( 'https://youtube.com/embed/' + id );
        }
      );
    });
    return finalLink;
  }

  getLatestVideoFromPlaylist(playlistID: string): Promise<any> {
    let finalLink = new Promise((resolve, reject) => {
      this.http.get('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.youtube.com%2Ffeeds%2Fvideos.xml%3Fplaylist_id%3D' + playlistID)
        .subscribe(
        (data) => {
          const link = data['items'][0].link;
          const id = link.substr(link.indexOf('=') + 1);
          resolve( 'https://youtube.com/embed/' + id );
        }
      );
    });
    return finalLink;
  }
}
