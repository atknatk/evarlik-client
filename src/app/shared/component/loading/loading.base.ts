import { IKbHttpExtraConfig } from '../../services/http/http-result-extra.config';

export class KbLoadingBase {
  loading = false;
  showContentOnLoading = true;
  context: any = this;

  protected loadingContext() {
    return {
      context: this.context,
      loading: this.loading
    };
  }

  protected getLoading(): IKbHttpExtraConfig {
    return {
      loadingBase: this
    };
  }

  protected showLoading(showContentOnLoading = true) {
    this.showContentOnLoading = showContentOnLoading;
    this.loading = true;
  }

  protected hideLoading() {
    this.showContentOnLoading = true;
    this.loading = false;
  }
}
