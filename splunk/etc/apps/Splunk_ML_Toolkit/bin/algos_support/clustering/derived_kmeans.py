import numpy as np
from scipy import stats
from sklearn.cluster import KMeans


class Derived_Kmeans(KMeans):
    def __init__(self, kmax=200, random_state=0):
        self.kmax_ = kmax
        self.random_state = random_state
        self.inertia_ = 0
        self.labels_ = []
        self.cluster_centers_ = []
        self.n_clusters = 0

    def _improve_parameters(self, X, centers):
        """
        Run K-means on dataset X starting with given centers

        Args:
        X (numpy array): array of shape [num_features, num_vectors]
        centers (numpy array): array of shape [num_features, num_centers]

        Returns:
        (Updated) labels, centers, inertia
        """
        num_centers = len(centers)

        if num_centers == 0:
            kmeans = KMeans(n_clusters=min(2, self.kmax_), random_state=self.random_state).fit(
                X
            )
        else:
            kmeans = KMeans(
                n_clusters=num_centers, init=centers, n_init=1, random_state=self.random_state
            ).fit(X)

        return kmeans.labels_, kmeans.cluster_centers_, kmeans.inertia_

    def _improve_structure(self, X, labels, centers):
        """
        Compute new K and new centers given input dataset X and its current labels and centers

        Args:
        X (numpy array): array of shape [num_features, num_vectors]
        labels (list): list of integer labels of the clusters. Length equals num_vectors
        centers (numpy array): array of shape [num_features, num_centers]

        Returns:
        numpy array of new centers

        """
        new_centers = []
        num_additional_clusters = 0
        max_additional_clusters = self.kmax_ - len(centers)
        unique_labels, counts = np.unique(labels[labels >= 0], return_counts=True)
        for cluster_label in unique_labels[np.argsort(-counts)]:
            # Going through the clusters, from large to small, and decide whether to split
            Y = np.array([X[i] for i in range(len(X)) if labels[i] == cluster_label])
            if len(Y) <= 2:
                new_centers.append(centers[cluster_label])
                continue

            # run k-means for cluster Y
            labels_Y, centers_Y, _ = self._improve_parameters(Y, [])
            if np.array_equal(centers_Y[0], centers_Y[1]):
                new_centers.append(centers[cluster_label])
                continue

            # decide to split or not
            split = self._splitting_criterion(
                X, labels, centers, [cluster_label], Y, labels_Y, centers_Y
            )
            if split and num_additional_clusters < max_additional_clusters:
                new_centers.extend(centers_Y)
                num_additional_clusters += 1
            else:
                new_centers.append(centers[cluster_label])

        return np.array(new_centers)

    def _splitting_criterion(
        self, X, labels_X, centers_X, cluster_indices_X, Y, labels_Y, centers_Y
    ):
        """
        Function to return True if a particular cluster in X should be split into two, False otherwise.

        Args:
        X (numpy array): array of shape [num_features, num_vectors]
        labels_X (list): list of integer labels of the clusters for X. Length equals num_vectors
        centers_X (numpy array): array of shape [num_features, num_centers]
        cluster_indices_X (list): list of one integer, the index of the cluster for X that needs to be split or not
        Y (numpy array): the vectors in the cluster
        labels_Y (list): the labels of each vectors in Y obtained by running K-means on Y
        centers_Y (numpy array): the centers obtained by running K-means on Y

        Returns:
        Boolean
        """

    def fit(self, X):
        if self.kmax_ > 1:
            while len(self.cluster_centers_) < self.kmax_:
                current_num_centers = len(self.cluster_centers_)
                self.labels_, self.cluster_centers_, self.inertia_ = self._improve_parameters(
                    X, self.cluster_centers_
                )
                new_centers = self._improve_structure(X, self.labels_, self.cluster_centers_)

                if current_num_centers == len(new_centers):
                    break
                else:
                    self.cluster_centers_ = new_centers

        self.labels_, self.cluster_centers_, self.inertia_ = self._improve_parameters(
            X, self.cluster_centers_
        )
        self.n_clusters = len(self.cluster_centers_)


class Xmeans(Derived_Kmeans):
    @staticmethod
    def _L2_squared(x, y):
        """
        Args: x and y are numpy arrays of the same dimensions
        Returns: the L2 distance between x and y squared
        """
        u = x - y
        return np.dot(u, u)

    @staticmethod
    def bayesian_information_criterion(X, labels, centers, cluster_indices):
        """
        Compute the Bayesian Information Criterion for X and the given clusters.
        This quantity measures how likely the clusters are spherical Gaussian distributions.
        For more details, see the paper "X-means: Extending K-means with Efficient Estimation of the Number of Clusters".
        """
        K = len(cluster_indices)
        bics = [np.inf] * K
        point_dim = np.shape(X)[1]

        sigma_squared = 0.0
        cluster_sizes = []
        for cluster_idx in cluster_indices:
            y = [
                Xmeans._L2_squared(X[i], centers[cluster_idx])
                for i in range(len(X))
                if labels[i] == cluster_idx
            ]
            sigma_squared += np.sum(y)
            cluster_sizes.append(len(y))

        N = sum(cluster_sizes)
        if N > K:
            sigma_squared /= N - K
            p = (K - 1) + (point_dim * K) + 1
            sigma_multiplier = (
                -np.inf if sigma_squared == 0 else point_dim * 0.5 * np.log(sigma_squared)
            )
            log_N = np.log(N)
            log_2_pi = np.log(2.0 * np.pi)
            p_term = p * 0.5 * log_N

            bics = [
                (n * np.log(n))
                - (n * log_N)
                - (n * 0.5 * log_2_pi)
                - (n * sigma_multiplier)
                - ((n - K) * 0.5)
                - p_term
                for n in cluster_sizes
            ]

        return np.sum(bics)

    def _splitting_criterion(
        self, X, labels_X, centers_X, cluster_indices_X, Y, labels_Y, centers_Y
    ):
        bic_Y_before_split = Xmeans.bayesian_information_criterion(
            X, labels_X, centers_X, cluster_indices_X
        )
        bic_Y_after_split = Xmeans.bayesian_information_criterion(
            Y, labels_Y, centers_Y, range(len(centers_Y))
        )
        return bic_Y_after_split > bic_Y_before_split


class Gmeans(Derived_Kmeans):
    @staticmethod
    def _project_data(X, v):
        """
        Linear projection of X onto vector v
        """
        normv = np.dot(v, v)
        return np.divide(np.sum(np.multiply(X, v), axis=1), normv)

    @staticmethod
    def _is_normal(X, centers, significance_level=1):
        v = np.subtract(centers[0], centers[1])
        X1 = Gmeans._project_data(X, v)
        anderson_statistic, critical_values, significance_levels = stats.anderson(
            X1, dist='norm'
        )
        return anderson_statistic < critical_values[-significance_level]

    def _splitting_criterion(
        self, X, labels_X, centers_X, cluster_indices_X, Y, labels_Y, centers_Y
    ):
        return not Gmeans._is_normal(Y, centers_Y)
